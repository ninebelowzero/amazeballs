angular.module('mazeApp', [])
    .controller('MazeController', MazeController);

function MazeController() {

    var maze = this;

    var gridHeight  = 10,
        gridWidth   = 10,
        interval    = 500;


    maze.reset = reset;

    maze.reset();


    // Functions (hoisted)

    function reset () {
        maze.grid = buildGrid(gridHeight, gridWidth);
        findPath();
    }

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

    function findPath() {

    }

}