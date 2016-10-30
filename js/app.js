angular.module('mazeApp', [])
    .controller('MazeController', ['$timeout', MazeController]);

function MazeController($timeout) {

    var maze = this;

    // Parameters controlling the maze and animation
    // - 'globally' available within the controller
    var gridHeight      = 20,
        gridWidth       = 20,
        startingPoint   = [0, 0],
        interval        = 100;

    maze.reset = reset;

    // Initializes the maze
    maze.reset();


    // Functions (hoisted)

    function reset () {
        maze.grid = buildGrid(gridHeight, gridWidth);
        findPath(startingPoint);
    }

    function Cell() {
        this.visited   = 0;
        this.right  = 0;
        this.below  = 0;
    }

    // Creates the blank grid
    function buildGrid(gridHeight, gridWidth) {

        var grid = [];

        for (var i = 0; i < gridHeight; i++) {
            var row = [];
            for (var j = 0; j < gridWidth; j++) {
                row.push(new Cell());
            }
            grid.push(row);
        }

        return grid;
    }

    // Gradually clears a series of paths for the maze
    function findPath(coords) {

        clearCell(coords, 1);

    }

    function clearCell(coords, visit) {

        var cell = maze.grid[coords[0]][coords[1]];

        // Ignores the cell if it has already been visited
        // if (cell.firstPass.visited || cell.secondPass.visited) return;

        cell.visited = visit;

        var neighbors = [],
            directions = [];
        var neighborCoords, direction;

        if (coords[0] > 0) {
            neighborCoords = [coords[0] - 1, coords[1]];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].visited) {
                neighbors.push(neighborCoords);
                directions.push("U");
            }
        }

        if (coords[0] < gridHeight - 1) {
            neighborCoords = [coords[0] + 1, coords[1]];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].visited) {
                neighbors.push(neighborCoords);
                directions.push("D");
            }
        }

        if (coords[1] > 0) {
            neighborCoords = [coords[0], coords[1] - 1];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].visited) {
                neighbors.push(neighborCoords);
                directions.push("L");
            }
        }

        if (coords[1] < gridWidth - 1) {
            neighborCoords = [coords[0], coords[1] + 1];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].visited) {
                neighbors.push(neighborCoords);
                directions.push("R");
            }
        }

        if (neighbors.length === 0) {
            return;
            // $timeout(clearCell, interval, true, coords, "secondPass");
        }

        var r = Math.floor(Math.random() * neighbors.length);

        $timeout(clearWall, interval, true, coords, neighbors[r], directions[r], visit);

    }

    function clearWall(originalCoords, newCoords, direction, visit) {

        if (direction === "R") {
            maze.grid[originalCoords[0]][originalCoords[1]].right = visit;
        } else if (direction === "D") {
            maze.grid[originalCoords[0]][originalCoords[1]].below = visit;
        } else if (direction === "L") {
            maze.grid[newCoords[0]][newCoords[1]].right = visit;
        } else if (direction === "U") {
            maze.grid[newCoords[0]][newCoords[1]].below = visit;
        }

        $timeout(clearCell, interval, true, newCoords, 1);
    }

}
