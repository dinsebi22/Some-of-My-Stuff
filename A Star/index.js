// GENERATE THE GRID
// GENERATE THE GRID
// GENERATE THE GRID

generateGrid: {
    var grid = document.getElementById('grid')
    var cellCountWidth = 55;
    var cellCountHeight = 33;
    var count = 1;
    var wayToEnd = [];

    var unitAI = { x, y };

    var gridData = new Array(cellCountHeight);
    for (var i = 0; i < gridData.length; i++) {
        gridData[i] = new Array(cellCountWidth);
    }
}

displayGrid: {
    for (var x = 0, i = 0; i < cellCountHeight; i++) {
        var rowOfCells = document.createElement('div');
        for (var y = 0, j = 0; j < cellCountWidth; j++) {

            var cell = document.createElement('span');
            cell.classList.add('cellStyle', 'road');
            cell.id = count;
            gridData[i][j] = { theHtml: cell, cellId: cell.id, Gcost: 0, Hcost: 0, Fcost: 0 };
            rowOfCells.appendChild(cell);

            count++;
        }
        rowOfCells.classList.add('rowOfCells')
        grid.appendChild(rowOfCells)
    }
    calculateCellCostFromStart();
}

// CREATE THE START AND THE END WITH THE DRAW WALL FUNCTION
// CREATE THE START AND THE END WITH THE DRAW WALL FUNCTION
// CREATE THE START AND THE END WITH THE DRAW WALL FUNCTION
{
    // Start Point
    var startPos = 1;
    start: {
        var start = document.getElementById(gridData[startPos][startPos].cellId);
        start.id = 'start';
        start.position = { x, y }
        start.position.x = 12;
        start.position.y = 4;

        unitAI.x = start.position.x;
        unitAI.y = start.position.y;

        wayToEnd.push(start.position);
    }

    //End Point
    end: {
        var end = document.getElementById((cellCountHeight * cellCountWidth));
        end.id = 'end';
        end.position = { x, y }

        end.position.x = cellCountWidth - 1;
        end.position.y = cellCountHeight - 1;
        start.style = 'background-color:rgb(0,255,0)';
        end.style = 'background-color:rgb(255,0,0)'
    }
}

// COST OF MOVEMENT 
// COST OF MOVEMENT 
// COST OF MOVEMENT 
function calculateCellCostFromStart(x, y) {
    for (var i = 0; i < gridData.length; i++) {
        for (var j = 0; j < gridData[i].length; j++) {
            if (j == y) {
                gridData[i][j].Gcost = Math.abs(((x) - (i)) * 10);
            } else if (i == x) {
                gridData[i][j].Gcost = Math.abs((y) - (j)) * 10;
            } else {
                gridData[i][j].Gcost = (Math.abs(x - i) + Math.abs(y - j)) * 7;
            }
        }
    }
    F_Cost_Calculator();
}
calculateCellCostFromStart(start.position.x, start.position.y);

function F_Cost_Calculator() {
    for (var i = 0; i < gridData.length; i++) {
        for (var j = 0; j < gridData[i].length; j++) {
            gridData[i][j].Hcost = (Math.abs(cellCountWidth - i) + Math.abs(cellCountHeight - j)) * 7;
            gridData[i][j].Fcost = gridData[i][j].Hcost + gridData[i][j].Gcost;
            // gridData[i][j].theHtml.innerText = gridData[i][j].Fcost;
        }
    }

}


neighbours: {

    function getBestWay() {
        var refreshIntervalID = setInterval(function() {

            var Neigh = neighboursPositionsData();

            Neigh = checkIfExists(Neigh);
            var nextPoint = { x, y };
            var bestWay = gridData[Neigh[0].y][Neigh[0].x].Fcost;

            for (var i = 1; i < Neigh.length; i++) {

                if (gridData[Neigh[i].y] != undefined && gridData[Neigh[i].y][Neigh[i].x] != undefined && bestWay > gridData[Neigh[i].y][Neigh[i].x].Fcost && wasVisited(Neigh[i].y, Neigh[i].x)) {
                    nextPoint.x = Neigh[i].x
                    nextPoint.y = Neigh[i].y
                    bestWay = gridData[Neigh[i].y][Neigh[i].x].Fcost;

                }

                // Neigh.sort((a, b) => {
                //     return a.Fcost < b.Fcost;
                // });
                // nextPoint.x = Neigh[0].x
                // nextPoint.y = Neigh[0].y
            }

            start.position.x = nextPoint.x;
            start.position.y = nextPoint.y;
            wayToEnd.push(nextPoint);

            if (start.position.x == end.position.x && start.position.y == end.position.y) {
                end.style = "background-color: rgb(0,255,0);";
                clearInterval(refreshIntervalID);
                paintWay(wayToEnd);
                return;
            }
            var newStartPos = document.getElementById(gridData[nextPoint.y][nextPoint.x].cellId)
            newStartPos.style = "background-color: rgb(0,255,0);"

            calculateCellCostFromStart(start.position.x, start.position.y);

        }, 300);

    }
    getBestWay();

















    function wasVisited(x, y) {
        for (var i = 0; i < wayToEnd.length; i++) {
            if (wayToEnd[i].x == x && wayToEnd[i].y == y) {
                return false;
            }
        }
        return true;

    }

    function checkIfExists(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].x < 0 || arr[i].x >= cellCountWidth || arr[i].y < 0 || arr[i].y >= cellCountHeight) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }







}

















function neighboursPositionsData() {
    var N = { x: start.position.x, y: start.position.y - 1, Fcost: gridData[x][y].Fcost };
    var S = { x: start.position.x, y: start.position.y + 1, Fcost: gridData[x][y].Fcost };
    var E = { x: start.position.x + 1, y: start.position.y, Fcost: gridData[x][y].Fcost };
    var V = { x: start.position.x - 1, y: start.position.y, Fcost: gridData[x][y].Fcost };
    var NE = { x: start.position.x + 1, y: start.position.y - 1, Fcost: gridData[x][y].Fcost };
    var NV = { x: start.position.x - 1, y: start.position.y - 1, Fcost: gridData[x][y].Fcost };
    var SE = { x: start.position.x - 1, y: start.position.y + 1, Fcost: gridData[x][y].Fcost };
    var SV = { x: start.position.x + 1, y: start.position.y + 1, Fcost: gridData[x][y].Fcost };

    var neighbours = [N, S, E, V, NE, NV, SV, SE];
    return neighbours;
}

function paintWay() {
    for (var i = 0; i < wayToEnd.length; i++) {
        gridData[wayToEnd[i].y][wayToEnd[i].x].theHtml.style = 'background-color:blue;';
    }
}
// ================================================================================================================
// ================================================================================================================
// ================================================================================================================
// ================================================================================================================
// ================================================================================================================
// ================================================================================================================
// ================================================================================================================
// ================================================================================================================
// ================================================================================================================


draw: {
    function getMouseAfterClick() {
        console.log(this.id);
        this.classList.remove('road');
        this.classList.add('wall');
        $('#grid').mouseup(function() {
            $('.cellStyle').unbind('mousemove');
        })
    }
    $('#grid').mousedown(function() {
        $('.cellStyle').bind('mousemove', getMouseAfterClick);
    });
}

// }