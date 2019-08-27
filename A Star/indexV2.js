var wayToEnd = [];

var startPosition = { x: 10, y: 2 };
var endPosition = { x: 22, y: 31 };

function initGrid(cellCountWidth, cellCountHeight) {
    var grid = document.getElementById("grid");

    var gridData = new Array(cellCountHeight);
    for (var i = 0; i < gridData.length; i++) {
        gridData[i] = new Array(cellCountWidth);
    }

    var count = 0;
    for (var i = 0; i < gridData.length; i++) {
        var rowOfCells = document.createElement("div");
        for (var j = 0; j < gridData[i].length; j++) {
            var cell = document.createElement("span");
            cell.classList.add("cellStyle", "road");
            cell.id = count;
            gridData[i][j] = {
                theHtml: cell,
                cellId: cell.id,
                position: { x: j, y: i },
                isWall: false,
                Gcost: 0,
                Hcost: 0,
                Fcost: 0
            };
            rowOfCells.appendChild(cell);
            count++;
        }
        rowOfCells.classList.add("rowOfCells");
        grid.appendChild(rowOfCells);
    }
    return gridData;
}

function arrWalls(grid) {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {

        }
    }
}

var theGrid = initGrid(50, 33);

function generateStartPos(gridData, x, y) {
    gridData[y][x].theHtml.id = "Start";
    gridData[y][x].theHtml.style = "background-color: green";
    return gridData[y][x];
}

function generateEndPos(gridData, x, y) {
    gridData[y][x].theHtml.id = "End";
    gridData[y][x].theHtml.style = "background-color: Red";
    return gridData[y][x];
}
var startPos = generateStartPos(theGrid, startPosition.x, startPosition.y);
var endPos = generateEndPos(theGrid, endPosition.x, endPosition.y);

function getHeuristicValue(pos1, pos2) {
    var dist1 = Math.abs(pos2.x - pos1.x);
    var dist2 = Math.abs(pos2.y - pos1.y);
    return dist1 + dist2;
}

function neighboursPositionsData() {
    var N = { x: startPos.position.x, y: startPos.position.y - 1 };
    var S = { x: startPos.position.x, y: startPos.position.y + 1 };
    var E = { x: startPos.position.x + 1, y: startPos.position.y };
    var V = { x: startPos.position.x - 1, y: startPos.position.y };

    var neighbours = [N, S, E, V];
    return neighbours;
}

function calculateCost() {
    for (var i = 0; i < theGrid.length; i++) {
        for (var j = 0; j < theGrid[i].length; j++) {
            theGrid[i][j].Gcost = getHeuristicValue(startPos.position, theGrid[i][j].position);
            theGrid[i][j].Hcost = getHeuristicValue(theGrid[i][j].position, endPos.position);
            theGrid[i][j].Fcost = theGrid[i][j].Gcost + theGrid[i][j].Hcost;
            // if (theGrid[i][j].isWall) {
            //     theGrid[i][j].Fcost = theGrid.length * theGrid[0].length;
            // }
            // theGrid[i][j].theHtml.innerText = theGrid[i][j].Hcost;
        }
    }
}

function wasVisited(arr) {
    for (var i = 0; i < theWay.length; i++) {
        for (var j = 0; j < arr.length; j++) {
            if (theWay[i].x == arr[j].x && theWay[i].y == arr[j].y) {
                arr.splice(j, 1);
            }
        }
    }
    return arr;
}

draw: {
    function getMouseAfterClick() {
        this.classList.remove("road");
        this.classList.add("wall");
        theGrid[Math.floor(this.id / theGrid[0].length)][Math.floor(this.id % theGrid[0].length)].isWall = true;
        $("#grid").mouseup(function() {
            $(".cellStyle").unbind("mousemove");
        });
    }
    $("#grid").mousedown(function() {
        $(".cellStyle").bind("mousemove", getMouseAfterClick);
    });
}

function checkIfExists(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (
            arr[i].x < 0 ||
            arr[i].x >= theGrid[0].length ||
            arr[i].y < 0 ||
            arr[i].y >= theGrid.length ||
            theGrid[arr[i].y][arr[i].x].isWall
        ) {
            arr.splice(i, 1);
        }
    }
    return arr;
}
calculateCost();

var theWay = [];

var refreshIntervalID_in = null;
var refreshIntervalID = function() {
    clearInterval(refreshIntervalID_in);
    // theGrid = initGrid(99, 45);
    startPos = generateStartPos(theGrid, startPosition.x, startPosition.y);
    endPos = generateEndPos(theGrid, endPosition.x, endPosition.y);

    refreshIntervalID_in = setInterval(function() {
        theWay.push(startPos.position);

        var neighbours = wasVisited(checkIfExists(neighboursPositionsData()));

        var nextPosition = { x: neighbours[0].x, y: neighbours[0].y };
        var lowestF = theGrid[neighbours[0].y][neighbours[0].x].Fcost;

        for (var i = 1; i < neighbours.length; i++) {
            if (
                lowestF > theGrid[neighbours[i].y][neighbours[i].x].Fcost
            ) {
                nextPosition.x = neighbours[i].x;
                nextPosition.y = neighbours[i].y;
                lowestF = theGrid[neighbours[i].y][neighbours[i].x].Fcost;
            }
        }
        startPos = generateStartPos(theGrid, nextPosition.x, nextPosition.y);
        if (startPos.position.x == endPos.position.x && startPos.position.y == endPos.position.y) {
            clearInterval(refreshIntervalID_in);
            theWay.push(endPos.position);

            for (var i = 0; i < theWay.length; i++) {
                theGrid[theWay[i].y][theWay[i].x].theHtml.style = "background-color:blue;";
            }
        }

        calculateCost();
    }, 11);
};






function grapthSeach() {
    var frontier = new Queue;
    frontier.enqueue(startPos , true);
    while (!frontier.isEmpty) {
        var current = frontier.enqueue();
        
    }
}



class Queue {
    constructor() {
        collection = [];
        this.enqueue = function (element, visited) {
            collection.push({ cell: element, isVisited: visited });
        };
        this.dequeue = function () {
            return collection.shift();
        };
        this.size = function () {
            return collection.length;
        };
        this.isEmpty = function () {
            return (collection.length === 0);
        };
    }
}
