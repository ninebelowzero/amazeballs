angular.module('mazeApp', [])
    .controller('MazeController', ['$timeout', MazeController]);

function MazeController($timeout) {

    var maze = this;

    // Parameters controlling the maze and animation
    var gridHeight      = 10,
        gridWidth       = 10,
        startingPoint   = [0, 0],
        interval        = 500;

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

        var count = gridWidth;

        clearCell();

        function clearCell() {
            var cell = maze.grid[coords[0]][coords[1]];
            cell.open = true;

            if (Math.random() > 0.5) {
                cell.below = true;
                coords[0]++;
            } else {
                cell.right = true;
                coords[1]++;
            }


            count--;

            if (count > 0) {
                $timeout(clearCell, interval);
            }
        }

    }

}