angular.module('mazeApp', [])
    .controller('MazeController', ['$timeout', MazeController]);

function MazeController($timeout) {

    var maze = this;

    // Parameters controlling the maze and animation
    // - 'globally' available within the controller
    var gridHeight      = 10,
        gridWidth       = 10,
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

        clearCell(coords, "right");

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

    //     if (direction === "right") {

    //         if (coords[1] === gridWidth - 1) {
    //             return clearCell(coords, "down");
    //         }
    //         neighbor = maze.grid[coords[0]][coords[1] + 1];

    //         if (neighbor.open) {
    //             return clearCell(coords, "down");
    //         }

    //         cell.right = true;
    //         coords[1]++;
    //     } else if (direction === "down") {

    //         if (coords[0] === gridHeight - 1) {
    //             return clearCell(coords, "left");
    //         }

    //         neighbor = maze.grid[coords[0] + 1][coords[1]];
    //         if (neighbor.open) {
    //             return clearCell(coords, "left");
    //         }

    //         cell.below = true;
    //         coords[0]++;
    //     } else if (direction === "left") {

    //         if (coords[1] === 0) {
    //             return clearCell(coords, "up");
    //         }

    //         neighbor = maze.grid[coords[0]][coords[1] - 1];
    //         if (neighbor.open) {
    //             return clearCell(coords, "up");
    //         }

    //         neighbor.right = true;
    //         coords[1]--;
    //     } else if (direction === "up") {

    //         if (coords[0] === 0) {
    //             return clearCell(coords, "right");
    //         }

    //         neighbor = maze.grid[coords[0] - 1][coords[1]];
    //         if (neighbor.open) {
    //             return clearCell(coords, "right");
    //         }

    //         neighbor.below = true;
    //         coords[0]--;
    //     }

    //     $timeout(clearCell, interval, true, coords, direction);

    // }

}








// var r = Math.random();
// console.log("r:", r);
// var neighbor;

// if (r < 0.25) {
//     console.log("Move down");
//     try {
//         neighbor = maze.grid[coords[0] + 1][coords[1]];
//         if (neighbor.open) {
//             clearCell();
//         } else {
//             cell.below = true;
//             coords[0]++;
//         }
//     }
//     catch (e) {
//     //     // Will be triggered when the algorithm looks outside the grid area
//     //     // - no biggie
//         return clearCell();
//     }

// } else if (r < 0.5) {
    // console.log("Move right");
    // // try {
    //     neighbor = maze.grid[coords[0]][coords[1] + 1];
    //     if (neighbor.open) {
    //         clearCell();
    //     } else {
    //         cell.right = true;
    //         coords[1]++;
    //     }
    // }
    // catch (e) { return clearCell();}

// } else if (r < 0.75) {
//     console.log("Move up");
//     try {
//         neighbor = maze.grid[coords[0] - 1][coords[1]];
//         if (neighbor.open) {
//             clearCell();
//         } else {
//             neighbor.below = true;
//             coords[0]--;
//         }
//     } catch (e) {return clearCell();}

// } else {
//     console.log("Move left");
//     try {
//         neighbor = maze.grid[coords[0]][coords[1] - 1];
//         if (neighbor.open) {
//             clearCell();
//         } else {
//             neighbor.right = true;
//             coords[1]--;
//         }
//     } catch(e) {return clearCell();}

// }