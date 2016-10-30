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

    // Extending Sylvester's Matrix type with some syntactic sugar to making it
    // trivial to access an element, given its coordinates as a Vector
    Matrix.prototype.at = function(v) {
        if (!(v instanceof Vector)) throw TypeError("Input must be a Vector object.");

        // Reversing the intuitive order here, since my vectors were originally
        // based on nested arrays, meaning the first element represented the column
        // and the second the row. Matrices work the other way round.
        // Also converting from zero-indexing to 1-indexing
        var i = v.e(2) + 1;
        var j = v.e(1) + 1;

        return this.e(i, j);
    };

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
        if (visit === 2 && $V(coords).eql(startingPoint)) return;

        //  Checks if any neighboring cells have not yet been visited
        var neighbors = findUnvisitedNeighbors(coords);

        // If so, pick one at random and move on
        if (neighbors.length > 0) {
            var r = Math.floor(Math.random() * neighbors.length);
            promises.push($timeout(clearWall, interval, true, neighbors[r], 1));
            return;
        }

        // Otherwise, start backtracking
        if (visit === 1) {
            promises.push($timeout(clearCell, interval, true, coords, 2));
            return;
        }

        // If cell is already marked as visited twice, look for the path back
        if (cell.right === 1) {
            coords[1]++;
            coords.direction = 0;
        } else if (cell.below === 1) {
            coords[0]++;
            coords.direction = 1;
        } else if (coords[1] > 0 && maze.grid[coords[0]][coords[1] - 1].right === 1) {
            coords[1]--;
            coords.direction = 2;
        } else if (coords[0] > 0 && maze.grid[coords[0] - 1][coords[1]].below === 1) {
            coords[0]--;
            coords.direction = 3;
        }

        promises.push($timeout(clearWall, interval, true, coords, 2));

    }


    // Clear the wall separating the cell from its neighbor.
    // This is slightly awkward because of the way the walls are handled in the CSS
    // - each wall belongs to only one cell, not two
    function clearWall(coords, visit) {

        var cell = maze.grid[coords[0]][coords[1]];

        if (coords.direction === 0) {
            maze.grid[coords[0]][coords[1] - 1].right = visit;
        } else if (coords.direction === 1) {
            maze.grid[coords[0] - 1][coords[1]].below = visit;
        } else if (coords.direction === 2) {
            cell.right = visit;
        } else if (coords.direction === 3) {
            cell.below = visit;
        }

        promises.push($timeout(clearCell, interval, true, coords, visit));
    }


    function findUnvisitedNeighbors(coords) {

        var neighbors = [];

        // Convert coords into a Sylvester.js vector object - without this the logic is ugly
        coords = $V(coords);

        var vectors = [
            $V([0, 1]),
            $V([1, 0]),
            $V([0, -1]),
            $V([-1, 0])
        ];

        vectors.forEach(function(vector, i) {

            try {
                // v represents the coordinates of a neighboring cell
                v = coords.add(vector);
                // Check if v has been visited. NB: Vector indices start from 1, not 0
                if (!maze.grid[v.e(1)][v.e(2)].visited) {
                    // If not visited, add it to the list
                    var neighbor = v.elements;
                    // Storing i, the index of the original vector, tells us which
                    // direction we're moving in. That's used in the clearWall function
                    neighbor.direction = i;
                    neighbors.push(neighbor);
                }
            }
            catch (error) {
                // JavaScript will shout if you try to access an array with an index
                // that falls out of range - either because it's negative or because it
                // is larger than the size of the array. Either way, no biggie.
            }
        });

        return neighbors;
    }

}
