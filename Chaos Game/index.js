let canvas;
let ctx ;
let fps = 120;

let positions = [
    { x: window.innerWidth / 2, y: 100 },
    { x: 20, y: window.innerHeight - 100 },
    { x: window.innerWidth - 20, y: window.innerHeight - 100 },
]
let diceRolls = [[1, 2], [3, 4], [5, 6]]

let randomPoint = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 3
}

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    init();
    setInterval(execute, 1000 / fps);
}

function execute () {
    for (let i = 0; i < 100 ; i++){
        let middlePoint = getMiddle(randomPoint)
        randomPoint = middlePoint;
    }
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
    ctx.arc(point.x, point.y, 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
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

// function animate() {
//     requestAnimationFrame(animate);
//     let middlePoint = getMiddle(start)
//     start = middlePoint;
// }


// requestAnimationFrame(animate)


