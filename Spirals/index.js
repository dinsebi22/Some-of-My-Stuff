let windowW = window.innerWidth;
let windowH = window.innerHeight;

const canvas = document.querySelector('#canvas');
canvas.width = windowW;
canvas.height = windowH;
const ctx = canvas.getContext('2d');
const n = noise;

let startTime = (new Date()).getTime();

class Line {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = 'white';
        this.prevX = x;
        this.prevY = y;
        this.step = {
            x: this.getRandomVal(-5, 5),
            y: this.getRandomVal(-5, 5)
        }
    }

    getRandomVal(min, max) {
        return Math.random() * (max - min) + min;
    }

    addNoise() {
        let currentTime = (new Date()).getTime();
        let passedTime = currentTime - startTime;

        this.step.x += n.simplex3(this.x * 0.05, this.y * 0.05, passedTime * 0.0001) * 0.4;
        this.step.y += n.simplex3(this.y * 0.05, this.x * 0.05, passedTime * 0.0001) * 0.4;
        this.x += this.step.x;
        this.y += this.step.y;
    }


    drawLine(time) {
        ctx.beginPath();
        ctx.strokeStyle = this.color
        ctx.lineWidth = 0.1;
        ctx.moveTo(this.x, this.y)
        this.addNoise();
        ctx.lineTo(this.x + this.step.x, this.y + this.step.y)
        ctx.stroke();
        ctx.closePath();
        this.checkIfExited();
    }

    checkIfExited() {
        if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) {
            lines.splice(lines.indexOf(this), 1);
        }
    }


}

let lines = [];


function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    widnowH = window.innerHeight;
    ctx.clearRect(0, 0, window.innerwidth, window.innerHeight)

    lines = [];

    addLines(5000);
    requestAnimationFrame(animate);

}

function checkIfResized() {
    return (windowH !== window.innerHeight || windowW !== window.innerWidth) ? true : false;
}


function addLines(count) {
    for (let i = 0; i < count; i++) {
        lines.push(new Line(window.innerWidth / 2, window.innerHeight / 2))
    }
}
addLines(5000);

function animate() {
    if (checkIfResized()) {
        resizeCanvas();
        return;
    }

    for (let i = 0; i < lines.length; i++) {
        lines[i].drawLine();
    }
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)