let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas = document.getElementById('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

function getPos(){
   var pos = [
      { x: window.innerWidth / 2, y: 100 },
      { x: 20, y: window.innerHeight - 100 },
      { x: window.innerWidth - 20, y: window.innerHeight - 100 },
    ]
   return pos;
}

let positions = getPos();
let diceRolls = [[1, 2], [3, 4], [5, 6]]

let randomPoint = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 3
}

function init() {
    for (let i = 0; i < positions.length; i++) {
        ctx.beginPath();
        ctx.arc(positions[i].x, positions[i].y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

function addRandomPoint(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    return { x: point.x, y: point.y }
}

function getMiddle(current) {
    let diceRoll = roleDice();
    let dicePosition = 0;

    for (let i = 0; i < diceRolls.length; i++) {
        if (diceRolls[i].includes(diceRoll)) {
            dicePosition = i;
            let pointPosition = { x: positions[dicePosition].x, y: positions[dicePosition].y }
            let middlePoint = { x: (current.x + pointPosition.x) / 2, y: (current.y + pointPosition.y) / 2 }
            return addRandomPoint(middlePoint)
        }
    }

}

function roleDice() {
    return Math.floor(Math.random() * 6) + 1
}


function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    widnowH = window.innerHeight;
    ctx.clearRect(0, 0, window.innerwidth, window.innerHeight)

   positions = getPos();
   requestAnimationFrame(animate);

}

function checkIfResized() {
    return (windowH !== window.innerHeight || windowW !== window.innerWidth) ? true : false;
}


function animate() {
   
   if (checkIfResized()) {
        resizeCanvas();
        return;
    }
   
    requestAnimationFrame(animate);
    for (let i = 0; i < 30; i++) {
        let middlePoint = getMiddle(randomPoint)
        randomPoint = middlePoint;
    }

}

init();
requestAnimationFrame(animate)
