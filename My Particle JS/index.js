var canvas = document.getElementById('panel');
let windowW = window.innerWidth;
let windowH = window.innerHeight;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');
let startTime = (new Date()).getTime();
let particles = [];


function Particle(x, y, dx, dy, radius) {

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.connections = [];

    this.draw = function() {
        c.beginPath();

        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        c.closePath();
        c.fillStyle = 'white';
        c.fill();
    }

    this.update = function() {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }


    this.connect = function(o) {
        if (Math.abs(this.x - o.x) < 200 && Math.abs(this.y - o.y) < 200) {
            c.beginPath();
            c.moveTo(this.x, this.y);
            c.strokeStyle = 'white';
            c.lineTo(o.x, o.y)
            c.lineWidth = 0.2;
            c.stroke();
            c.closePath();
        }
    }
}

function initP(particleCount, maxRadius, maxSpeed) {
    for (let i = 0; i < particleCount; i++) {
        var x = Math.random() * (innerWidth - maxRadius * 2) + maxRadius;
        var dx = (Math.random() - 0.5) * maxSpeed;

        var y = Math.random() * (innerHeight - maxRadius * 2) + maxRadius;
        var dy = (Math.random() - 0.5) * maxSpeed;

        var radius = Math.random() * maxRadius;
        particles.push(new Particle(x, y, dx, dy, radius))

    }
}

function initC(maxConnections) {
    for (let i = 0; i < particles.length; i++) {
        connectionCount = Math.floor(Math.random() * maxConnections);
        for (let j = 0; j < connectionCount; j++) {
            particles[i].connections.push(particles[Math.floor(Math.random() * particles.length)])
        }

    }
}


function resizeCanvas() {
    c.canvas.width = window.innerWidth;
    c.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    widnowH = window.innerHeight;
    c.clearRect(0, 0, window.innerwidth, window.innerHeight)

    particles = [];
    // Particle Count , Particle Radius , Max speed of particle
    initP(100, 5, 5);
    // Number of connections
    initC(10);
    requestAnimationFrame(animate);

}

function checkIfResized() {
    return (windowH !== window.innerHeight || windowW !== window.innerWidth) ? true : false;
}

function animate() {
   if (checkIfResized()) {
        resizeCanvas();
        return;
    }else{
       c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    requestAnimationFrame(animate);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    for (let i = 0; i < particles.length - 1; i++) {
        for (let j = 0; j < particles[i].connections.length; j++) {
            particles[i].connect(particles[i].connections[j]);
        }
    }
}


// Particle Count , Particle Radius , Max speed of particle
initP(100, 5, 5);
// Number of connections
initC(10);
animate();





////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FPS COUNTER
// FPS COUNTER
// FPS COUNTER
{
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.ieRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var fpsElement = document.getElementById("fps");

    var then = Date.now() / 1000; // get time in seconds
    var render = function() {
        var now = Date.now() / 1000; // get time in seconds

        // compute time since last frame
        var elapsedTime = now - then;
        then = now;

        // compute fps
        var fps = 1 / elapsedTime;
        fpsElement.innerText = Math.floor(fps);

        requestAnimFrame(render);
    };
    render();
}
