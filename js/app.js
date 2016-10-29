angular.module('mazeApp', [])
    .controller('MazeController', MazeController);

function MazeController() {

    var maze = this;

    var gridHeight = 10;
    var gridWidth = 10;

    maze.grid = [];

    for (var i = 0; i < gridHeight; i++) {

        var row = [];

        for (var j = 0; j < gridWidth; j++) {
            row.push({ top: false, left: false });
        }

        maze.grid.push(row);
    }

}