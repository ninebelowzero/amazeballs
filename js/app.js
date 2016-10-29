angular.module('mazeApp', [])
    .controller('MazeController', MazeController);

function MazeController() {

    var maze = this;

    maze.grid = [
        ["yo", "yo", "yo", "yo"],
        ["yo", "yo", "yo", "yo"],
        ["yo", "yo", "yo", "yo"],
        ["yo", "yo", "yo", "yo"]
    ]

};