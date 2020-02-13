let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 0;
let y = 0;

function calculateAndDraw() {

    let nextPosition = {
        nextX:0 ,
        nextY:0
    };

    let randomValue = Math.random();

    if (randomValue < 0.01) {
        nextPosition.nextX = 0;
        nextPosition.nextY = 0.16 * y;
    } else if (randomValue < 0.86) {
        nextPosition.nextX = 0.85 * x + 0.04 * y;
        nextPosition.nextY = -0.04 * x + 0.85 * y + 1.6;
    } else if (randomValue < 0.93) {
        nextPosition.nextX = 0.20 * x - 0.26 * y;
        nextPosition.nextY = 0.23 * x + 0.22 * y + 1.6;
    } else {
        nextPosition.nextX = -0.15 * x + 0.28 * y;
        nextPosition.nextY = 0.26 * x + 0.24 * y + 0.44;
    }

    let newPointPositionX = canvas.width * (x + 2.8) / 6;
    let newPointPositionY = canvas.height - canvas.height * ((y + 2) / 14);

    addPoint(newPointPositionX, newPointPositionY, 0.1, 'white');

    x = nextPosition.nextX;
    y = nextPosition.nextY;

}

function addPoint(centerX, centerY, radius, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
}

function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    windowH = window.innerHeight;
   
    ctx.clearRect(0, 0, window.innerwidth, window.innerHeight)

    requestAnimationFrame(animate);

}

function checkIfResized() {
    return (windowH !== window.innerHeight || windowW !== window.innerWidth) ? true : false;
}

function animate(){
   requestAnimationFrame(animate)
   
   if (checkIfResized()) {
        resizeCanvas();
        return;
    }
   
   for (let i = 0; i < 200; i++){
        calculateAndDraw()
    }
   
}
   requestAnimationFrame(animate)
