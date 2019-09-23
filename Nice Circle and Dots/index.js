let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let canvasCenterX = window.innerWidth / 2;
let canvasCenterY = window.innerHeight / 2;

let startTime = (new Date()).getTime();
let dots = [];

let offset = 0;

function Dot(x, y, radius, centerOffset, radialAngleOnCircle) {

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.centerOffset = centerOffset;
    this.radialAngleOnCircle = radialAngleOnCircle
    this.count = undefined;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, 0)
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    this.connect = function(d) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(d.x, d.y);
        ctx.lineWidth = 0.4;
        ctx.strokeStyle = "white"
        ctx.closePath();
        ctx.stroke();
    }

    this.roatate = function() {
        let interval = Math.PI * 2 / this.count;
        let currentTime = (new Date()).getTime();
        let passedTime = currentTime - startTime;

        this.x = canvasCenterX + this.centerOffset * Math.cos(((passedTime) / 10000) + offset);
        this.y = canvasCenterY + this.centerOffset * Math.sin(((passedTime) / 10000) + offset);
        offset += interval;
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < dots.length; i++) {
        dots[i].draw();
        dots[i].roatate();
    }

    //Connect each Dot Diagonaly
    for (let i = 0; i < dots.length / 2; i++) {
        dots[i].connect(dots[dots.length / 2 + i]);

    }

    //Connect each dot to next one
    for (let i = 0; i < dots.length - 1; i++) {
        dots[i].connect(dots[i + 1]);
        if (i + 1 === dots.length - 1) dots[i + 1].connect(dots[0]);

    }

}

function init(dotCount, centerOffset) {

    let interval = Math.PI * 2 / dotCount;

    for (let i = 0; i < dotCount; i++) {
        // let radialAngleOnCircle = interval * i;
        let xPos = canvasCenterX + centerOffset * Math.cos(interval);
        let yPos = canvasCenterY + centerOffset * Math.sin(interval);

        dots.push(new Dot(xPos, yPos, 2, centerOffset, interval))
        dots[i].count = dotCount;
    }

}

init(134, 300);
animate();