let windowW = window.innerWidth;
let windowH = window.innerHeight;

let cnvs = document.getElementById("cnvs");
cnvs.width = window.innerWidth;
cnvs.height = window.innerHeight;
let ctx = cnvs.getContext('2d');

let rain = [];

function Drop(x, y, maxDist) {
    this.x = x;
    this.y = y;
    this.maxDist = maxDist;
    this.dropSpeed = Math.random() * 5 + 7

    this.draw = function () {

        if (this.y >= this.maxDist) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.ellipse(this.x, this.y, 4, 2, 0, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            this.x = Math.random() * window.innerWidth - Math.random() * 100;
            this.y = -10;
        } else {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + 1, this.y + this.dropSpeed)
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white"
            ctx.stroke();
            ctx.closePath();
        }
    }
    this.move = function () {
        this.x += 1;
        this.y += this.dropSpeed;
    }
}

function street() {
    var grd = ctx.createLinearGradient(0, window.innerHeight, window.innerWidth, window.innerHeight);
      
    // Add colors
    grd.addColorStop(0.000, 'rgba(0, 0, 0, 1.000)');
    grd.addColorStop(0.974, 'rgba(58, 58, 58, 1.000)');

    // ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.fillRect(0, window.innerHeight - 210, window.innerWidth, window.innerHeight);
    ctx.fill();
    ctx.closePath();
}

function streetLine() {
    let offset = 20;

    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'rgb(211,211,211)';
        ctx.moveTo(offset, window.innerHeight - 150);
        ctx.lineTo(offset + 150, window.innerHeight - 150);
        ctx.lineTo(offset + 100, window.innerHeight - 130);
        ctx.lineTo(offset - 50, window.innerHeight - 130);
        ctx.lineTo(offset, window.innerHeight - 150);
        ctx.closePath();
        ctx.fill();
        offset += 250;
    }

}

function init() {
    for (let i = 0; i < 1000; i++) {
        rain.push(new Drop(Math.random() * window.innerWidth - 100, Math.random() * window.innerHeight - window.innerHeight, window.innerHeight - Math.random() * 200));
    }
}



function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    windowH = window.innerHeight;
    ctx.clearRect(0, 0, window.innerwidth, window.innerHeight)

    rain = [];
    init();
    requestAnimationFrame(animate);

}

function checkIfResized() {
    return (windowH !== window.innerHeight || windowW !== window.innerWidth) ? true : false;
}


function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (checkIfResized()) {
        resizeCanvas();
        return;
    }else{
           requestAnimationFrame(animate);
    }

    street();
    streetLine();

    for (let i = 0; i < rain.length; i++) {
        rain[i].move();
        rain[i].draw();
    }

}

init();
animate();
