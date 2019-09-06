var container = document.getElementById('container');
var columnsNum;
var cells = [];

function generateGrid() {
    var contStyle = container.style;
    contStyle.height = '97vh';
    contStyle.width = '100vw';
    contStyle.backgroundColor = 'black';
}

{
    columnsNum = 700;
    initButtnBlock();
    generateGrid();
}

var negHeight = container.clientHeight / columnsNum;
var heightIncrement = container.clientHeight / columnsNum;

function initButtnBlock() {
    var buttonBlock = document.getElementById('buttonBlock');
    buttonBlock.style.position = 'absolute';

}

function generate() {
    cells = [];

    const myNode = document.getElementById("container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    var newColNumber = $('#colNumber').val();
    console.log(newColNumber);

    negHeight = container.clientHeight / newColNumber;
    heightIncrement = container.clientHeight / newColNumber;

    for (let index = 0; index < newColNumber; index++) {
        cells.push(generateCell(index, newColNumber));
        container.append(cells[index].element);
    }
}

function generateCell(value, columns) {
    cell = {
        value: value,
        element: document.createElement('span')
    }
    cell.element.style.display = 'inline-block';
    cell.element.style.backgroundColor = 'white';
    cell.element.style.height = negHeight + 'px';
    cell.element.style.width = (Math.floor((container.clientWidth) / columns) - container.clientWidth / columns / 100) + 'px';
    negHeight += heightIncrement;
    return cell;
}

function addCells() {

    for (let index = 0; index < columnsNum; index++) {
        cells.push(generateCell(index, columnsNum));
        container.append(cells[index].element);
    }
}

addCells();

function ShuffleCells() {
    cells.sort(() => Math.random() - 0.5);
    container.childNodes = new Array();
    for (let index = 0; index < cells.length; index++) {
        container.append(cells[index].element);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function Sort() {

    quickSort(cells, 0, cells.length - 1);

    async function quickSort(arr, left, right) {
        let len = arr.length;
        let pivot;
        let partitionIndex;
        await sleep(1500);

        if (left < right) {
            pivot = right;

            partitionIndex = partition(arr, pivot, left, right);

            //sort left and right
            quickSort(arr, left, partitionIndex - 1);
            quickSort(arr, partitionIndex + 1, right);
        }
        return arr;
    }


    function partition(arr, pivot, left, right) {
        let pivotValue = arr[pivot].value;
        let partitionIndex = left;

        for (let i = left; i < right; i++) {
            if (arr[i].value < pivotValue) {
                swap(arr, i, partitionIndex);

                partitionIndex++;
            }
        }
        swap(arr, right, partitionIndex);
        redraw(cells.length);

        return partitionIndex;
    }

    function swap(arr, i, j) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    console.log("END");
}



function redraw(colNum) {
    container.childNodes = new Array();
    for (let index = 0; index < colNum; index++) {
        container.append(cells[index].element);
    }
}