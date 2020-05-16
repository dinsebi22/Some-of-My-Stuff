let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let radius = 30;
let ctx = canvas.getContext('2d');

let ratio = Math.abs(window.innerWidth/window.innerHeight)*200;

// random attractor params
var a = Math.random() * 4 - 2;
var b = Math.random() * 4 - 2;
var c = Math.random() * 4 - 2;
var d = Math.random() * 4 - 2;


class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.radius = radius;
        this.opacity = 0.05;
        this.decrement = 0.5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.strokeStyle = "rgba(255,255,255," + this.opacity + ")";
        ctx.fillStyle = 'black';
        ctx.stroke();
        ctx.fill();
    }

    getValue(x, y) {
        var scale = 0.1;
        x = (x - window.innerWidth / 2) * scale;
        y = (y - window.innerHeight / 2) * scale;

        var x1 = Math.sin(a * y) + c * Math.cos(a * x);
        var y1 = Math.sin(b * x) + d * Math.cos(b * y);
        return Math.trunc((y1 - y), x1 - x);
    }

    doVelocity() {
        var value = this.getValue(this.x, this.y);
        this.velocityX += Math.cos(value) * 0.1;
        this.velocityY += Math.sin(value) * 0.1;
        
        this.x += this.velocityX
        this.y += this.velocityY
        this.opacity += 1 / 70
        this.radius -= this.decrement;
        
        if (this.radius === 0) {
            this.decrement = 0;
        }
    }
}


let circles = [];


function init(circleCount) {
    for (let i = 0; i < circleCount; i++) {
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;
        var circle = new Circle(x, y);
        circle.draw();
        circles.push(circle)
    }
}

function drawCircles() {
    for (let i = 0; i < circles.length; i++) {
        circles[i].doVelocity();
        circles[i].draw();
    }
}



function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    windowH = window.innerHeight;
    ctx.clearRect(0, 0, window.innerwidth, window.innerHeight)
    ratio = Math.abs(window.innerWidth/window.innerHeight)*200;
    circles = [];
    init(ratio)
    requestAnimationFrame(animate);

}

function checkIfResized() {
    return (windowH !== window.innerHeight || windowW !== window.innerWidth) ? true : false;
}

init(ratio);
requestAnimationFrame(animate)


function animate() {
    if (checkIfResized()) {
        resizeCanvas();
        return;
    }
    
    drawCircles();


    requestAnimationFrame(animate)
}

