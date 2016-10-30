angular.module('mazeApp', [])
    .controller('MazeController', ['$timeout', MazeController]);

function MazeController($timeout) {

    var maze = this;

    // Parameters controlling the maze and animation
    // - 'globally' available within the controller
    var gridHeight      = 10,
        gridWidth       = 10,
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

    function clearCell(coords) {

        var cell = maze.grid[coords[0]][coords[1]];

        // Ignores the cell if it has already been visited
        // if (cell.firstPass.visited || cell.secondPass.visited) return;

        cell.visited = 1;

        var neighbors = findUnvisitedNeighbors(coords);

        if (neighbors.length === 0) {
            $timeout(backtrack, interval, true, coords);
            return;
        }

        var r = Math.floor(Math.random() * neighbors.length);

        $timeout(clearWall, interval, true, coords, neighbors[r]);

    }

    function clearWall(originalCoords, newCoords) {

        if (newCoords.direction === "R") {
            maze.grid[originalCoords[0]][originalCoords[1]].right = 1;
        } else if (newCoords.direction === "D") {
            maze.grid[originalCoords[0]][originalCoords[1]].below = 1;
        } else if (newCoords.direction === "L") {
            maze.grid[newCoords[0]][newCoords[1]].right = 1;
        } else if (newCoords.direction === "U") {
            maze.grid[newCoords[0]][newCoords[1]].below = 1;
        }

        $timeout(clearCell, interval, true, newCoords);
    }

    function backtrack(coords) {

        var cell = maze.grid[coords[0]][coords[1]];
        cell.visited = 2;

        if (coords[0] === 0 && coords[1] === 0) return;

        if (findUnvisitedNeighbors(coords).length > 0) {
            console.log("Branching needed.");
            return;
        }

        var direction;

        if (cell.right === 1) {
            direction = "R";
        } else if (cell.below === 1) {
            direction = "D";
        } else if (coords[1] > 0 && maze.grid[coords[0]][coords[1] - 1].right === 1) {
            direction = "L";
        } else if (coords[0] > 0 && maze.grid[coords[0] - 1][coords[1]].below === 1) {
            direction = "U";
        }

        $timeout(backtrackAcrossWall, interval, true, coords, direction);

    }

    function backtrackAcrossWall(coords, direction) {

        var cell = maze.grid[coords[0]][coords[1]];

        if (direction === "R") {
            cell.right = 2;
            newCoords = [coords[0], coords[1] + 1];
        } else if (direction == "D") {
            cell.below = 2;
            newCoords = [coords[0] + 1, coords[1]];
        } else if (direction == "L") {
            maze.grid[coords[0]][coords[1] - 1].right = 2;
            newCoords = [coords[0], coords[1] - 1];
        } else if (direction == "U") {
            maze.grid[coords[0] - 1][coords[1]].below = 2;
            newCoords = [coords[0] - 1, coords[1]];
        }

        $timeout(backtrack, interval, true, newCoords);
    }

    function findUnvisitedNeighbors(coords) {

        var neighbors = [],
            directions = [];

        var neighborCoords, direction;

        if (coords[0] > 0) {
            neighborCoords = [coords[0] - 1, coords[1]];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].visited) {
                neighborCoords.direction = "U";
                neighbors.push(neighborCoords);
            }
        }

        if (coords[0] < gridHeight - 1) {
            neighborCoords = [coords[0] + 1, coords[1]];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].visited) {
                neighborCoords.direction = "D";
                neighbors.push(neighborCoords);
            }
        }

        if (coords[1] > 0) {
            neighborCoords = [coords[0], coords[1] - 1];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].visited) {
                neighborCoords.direction = "L";
                neighbors.push(neighborCoords);
            }
        }

        if (coords[1] < gridWidth - 1) {
            neighborCoords = [coords[0], coords[1] + 1];
            if (!maze.grid[neighborCoords[0]][neighborCoords[1]].visited) {
                neighborCoords.direction = "R";
                neighbors.push(neighborCoords);
            }
        }

        return neighbors;
    }

}
