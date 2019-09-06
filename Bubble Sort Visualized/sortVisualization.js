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
    columnsNum = 110;
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

    let length = cells.length - 1;
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {

            if (cells[j].value > cells[j + 1].value) {

                cells[j].element.style.backgroundColor = 'green';
                cells[j + 1].element.style.backgroundColor = 'red';

                var temp = cells[j];
                cells[j] = cells[j + 1];
                cells[j + 1] = temp;
                swap(cells.length);

                await sleep(10);
                cells[j].element.style.backgroundColor = 'white';
                cells[j + 1].element.style.backgroundColor = 'white';
            }
        }
    }
    console.log("END");
}



function swap(colNum) {
    container.childNodes = new Array();
    for (let index = 0; index < colNum; index++) {
        container.append(cells[index].element);
    }
}