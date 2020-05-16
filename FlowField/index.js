let canvas = document.getElementById('canvas');
let windowW = window.innerWidth;
let windowH = window.innerHeight;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');
const n = noise;
let startTime = (new Date()).getTime();
let scale = Math.abs(window.innerWidth / window.innerHeight)*10;
var columns = Math.floor(window.innerWidth / scale) +5;
var rows = Math.floor(window.innerHeight / scale)+5;
period = 1 / 500;

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = x;
        this.vy = x;
        this.draw();
    }

    draw() {
        let currentTime = (new Date()).getTime();
        let passedTime = (currentTime - startTime) / 5000;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        var noise = n.perlin2(this.x*period + passedTime, this.y*period + passedTime)        
        ctx.lineTo(this.x + noise*50, this.y + noise*50)
        ctx.lineWidth = 10
        ctx.strokeStyle = 'rgb(0,'+ Math.abs(noise)*255 +',0)'
        ctx.stroke();
        ctx.closePath();        
    }
}

let vectors = []


function init() {
    
    for (let y = 0; y < rows; y++) {
        let row = [];
        for (let x = 0; x < columns; x++) {
            row.push(new Vector2(x * scale, y * scale))
        }
        vectors.push(row)
    }
}

init();

function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    windowH = window.innerHeight;
    ctx.clearRect(0, 0, window.innerwidth, window.innerHeight)
    scale = Math.abs(window.innerWidth / window.innerHeight)*10;
    vectors = [];
    init()
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

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    
    for (let i = 0; i < vectors.length; i++) {
        for (let j = 0; j < vectors[i].length; j++) {
            vectors[i][j].draw();
        }
    }
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)