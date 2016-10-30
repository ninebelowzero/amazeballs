angular.module('mazeApp', [])
    .controller('MazeController', ['$timeout', MazeController]);

function MazeController($timeout) {

    var maze = this;

    // Parameters controlling the maze and animation
    // - 'globally' available within the controller
    var gridHeight      = 20,
        gridWidth       = 40,
        startingPoint   = [0, 0],
        interval        = 10;

    var promises = [];

    maze.reset = function() {

        // Need to cancel all outstanding timeouts if you hit the reset button
        // while the maze is still generating
        promises.forEach($timeout.cancel);

        maze.grid = buildGrid(gridHeight, gridWidth);
        clearCell(startingPoint, 1);
    };

    // Initialize
    maze.reset();


    /*
     *********************
     * Private functions *
     *********************
     */

    // A constructor for cells in the grid
    function Cell() {
        this.visited    = 0;
        this.right      = 0;
        this.below      = 0;
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


    function clearCell(coords, visit) {

        var cell = maze.grid[coords[0]][coords[1]];

        // Set to 1 on first visit (blue by default), 2 on second visit (white)
        cell.visited = visit;

        // Exit the program on returning to the starting point for a second time
        if (visit === 2 && coords[0] === startingPoint[0] && coords[1] === startingPoint[1]) {
            return;
        }

        //  Checks if any neighboring cells have not yet been visited
        var neighbors = findUnvisitedNeighbors(coords);

        // If so, pick one at random and move on
        if (neighbors.length > 0) {
            var r = Math.floor(Math.random() * neighbors.length);
            promises.push($timeout(clearWall, interval, true, neighbors[r]));
            return;
        }

        // Otherwise, start backtracking
        if (visit === 1) {
            promises.push($timeout(clearCell, interval, true, coords, 2));
        } else {
            promises.push($timeout(backtrackAcrossWall, interval, true, coords));
        }

    }


    // Clear the wall separating the cell from its neighor.
    // This is slightly awkward because of the way the walls are handled in the CSS
    // - each wall belongs to only one cell, not two
    function clearWall(coords) {

        var cell = maze.grid[coords[0]][coords[1]];

        if (coords.direction === "R") {
            maze.grid[coords[0]][coords[1] - 1].right = 1;
        } else if (coords.direction === "D") {
            maze.grid[coords[0] - 1][coords[1]].below = 1;
        } else if (coords.direction === "L") {
            cell.right = 1;
        } else if (coords.direction === "U") {
            cell.below = 1;
        }

        promises.push($timeout(clearCell, interval, true, coords, 1));
    }


    function backtrackAcrossWall(coords) {

        var cell = maze.grid[coords[0]][coords[1]];

        if (cell.right === 1) {
            coords.direction = "R";
        } else if (cell.below === 1) {
            coords.direction = "D";
        } else if (coords[1] > 0 && maze.grid[coords[0]][coords[1] - 1].right === 1) {
            coords.direction = "L";
        } else if (coords[0] > 0 && maze.grid[coords[0] - 1][coords[1]].below === 1) {
            coords.direction = "U";
        }

        if (coords.direction === "R") {
            cell.right = 2;
            newCoords = [coords[0], coords[1] + 1];
        } else if (coords.direction == "D") {
            cell.below = 2;
            newCoords = [coords[0] + 1, coords[1]];
        } else if (coords.direction == "L") {
            maze.grid[coords[0]][coords[1] - 1].right = 2;
            newCoords = [coords[0], coords[1] - 1];
        } else if (coords.direction == "U") {
            maze.grid[coords[0] - 1][coords[1]].below = 2;
            newCoords = [coords[0] - 1, coords[1]];
        }

        promises.push($timeout(clearCell, interval, true, newCoords, 2));
    }

    function findUnvisitedNeighbors(coords) {

        var neighbors   = [];

        var neighborCoords;

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
