angular.module('mazeApp', [])
    .controller('MazeController', ['$timeout', MazeController]);

function MazeController($timeout) {

    var maze = this;

    // Parameters controlling the maze and animation
    // - 'globally' available within the controller
    var gridHeight      = 20,
        gridWidth       = 20,
        startingPoint   = [0, 0],
        interval        = 200;

    maze.reset = reset;

    // Initializes the maze
    maze.reset();


    // Functions (hoisted)

    function reset () {
        maze.grid = buildGrid(gridHeight, gridWidth);
        findPath(startingPoint);
    }

    // Creates the blank grid
    function buildGrid(gridHeight, gridWidth) {

        var grid = [];

        for (var i = 0; i < gridHeight; i++) {
            var row = [];
            for (var j = 0; j < gridWidth; j++) {
                row.push({ open: false, right: false, below: false });
            }
            grid.push(row);
        }

        return grid;
    }

    // Gradually clears a series of paths for the maze
    function findPath(coords) {

        clearCell(coords);

    }

    function clearCell(coords) {

        var cell = maze.grid[coords[0]][coords[1]];

        if (cell.open) return;

        cell.open = true;

        var neighbors = [],
            directions = [];
        var neighborCoords, direction;

        if (coords[0] > 0) {
            neighborCoords = [coords[0] - 1, coords[1]];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].open) {
                neighbors.push(neighborCoords);
                directions.push("U");
            }
        }

        if (coords[0] < gridHeight - 1) {
            neighborCoords = [coords[0] + 1, coords[1]];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].open) {
                neighbors.push(neighborCoords);
                directions.push("D");
            }
        }

        if (coords[1] > 0) {
            neighborCoords = [coords[0], coords[1] - 1];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].open) {
                neighbors.push(neighborCoords);
                directions.push("L");
            }
        }

        if (coords[1] < gridWidth - 1) {
            neighborCoords = [coords[0], coords[1] + 1];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].open) {
                neighbors.push(neighborCoords);
                directions.push("R");
            }
        }

        if (neighbors.length === 0) return;

        var r = Math.floor(Math.random() * neighbors.length);

        $timeout(clearWall, interval, true, coords, neighbors[r], directions[r]);

    }

    function clearWall(originalCoords, newCoords, direction) {

        if (direction === "R") {
            maze.grid[originalCoords[0]][originalCoords[1]].right = true;
        } else if (direction === "D") {
            maze.grid[originalCoords[0]][originalCoords[1]].below = true;
        } else if (direction === "L") {
            maze.grid[newCoords[0]][newCoords[1]].right = true;
        } else if (direction === "U") {
            maze.grid[newCoords[0]][newCoords[1]].below = true;
        }

        $timeout(clearCell, interval, true, newCoords);
    }


}
