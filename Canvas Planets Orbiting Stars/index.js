let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas = document.getElementById('container');
let context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Start time needed for calculating the rotation
let startTime = (new Date()).getTime();
let bodies = [];

// Get the Mouse position if needed

let mousePos = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
}

function getMousePos(canvas, e) {
    let rectangle = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rectangle.left;
    mousePos.y = e.clientY - rectangle.top;
}

window.addEventListener("mousemove", function(evt) {
    getMousePos(canvas, evt);
}, false)

// The Planet bodie object
function Bodie(x, y, radius, orbitRadius, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius * Math.random();
    this.orbitRadius = orbitRadius * Math.random();
    this.angle = angle * Math.random();
    this.roatationFactor = 4000;

    this.asteroids = [];
    this.shadowRadius = 14;
    this.shadowColor = "white"


    this.orbitPos = {
        x: undefined,
        y: undefined
    }

    this.orbit = function() {

        let currentTime = (new Date()).getTime();
        let passedTime = currentTime - startTime;

        // Draw The Planet
        context.beginPath();
        context.shadowBlur = this.shadowRadius;
        context.shadowColor = this.shadowColor;
        context.arc(canvas.width / 2 + Math.cos(this.angle * (passedTime / this.roatationFactor)) * this.orbitRadius,
            canvas.height / 2 + Math.sin(this.angle * (passedTime / this.roatationFactor)) * this.orbitRadius, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = 'rgba(255,255,255,0.9)';
        context.fill();


        this.orbitPos = {
            x: canvas.width / 2 + Math.cos(this.angle * (passedTime / this.roatationFactor)) * this.orbitRadius,
            y: canvas.height / 2 + Math.sin(this.angle * (passedTime / this.roatationFactor)) * this.orbitRadius
        }

        for (var j = 0; j < this.asteroids.length; j++) {
            // Update Position of planet relative to the asteroid
            this.asteroids[j].updatePos(this.orbitPos.x, this.orbitPos.y)
                //Apply the orbit Function to the asteroid
            this.asteroids[j].orbit();
        }
    }
}

//The Asteroid Object
function Asteroid(x, y, radius, orbitRadius, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius * Math.random();
    this.orbitRadius = orbitRadius * Math.random();
    this.angle = angle * Math.random();
    this.roatationFactor = 11000;

    this.shadowRadius = 11;
    this.shadowColor = "yellow"

    this.updatePos = function(x, y) {
        this.x = x;
        this.y = y;
    }

    this.orbit = function() {
        let currentTime = (new Date()).getTime();
        let passedTime = currentTime - startTime;

        //Draw The Asteroid
        context.beginPath();
        context.shadowBlur = this.shadowRadius;
        context.shadowColor = this.shadowColor;
        context.arc(this.x + Math.cos(this.angle * (passedTime / this.roatationFactor)) * this.orbitRadius,
            this.y + Math.sin(this.angle * (passedTime / this.roatationFactor)) * this.orbitRadius, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = this.shadowColor;
        context.fill();
    }
}



function init() {
    for (let i = 0; i < planetCount; i++) {
        // Bodie(pos.x , pos.y , element radius , orbit radius , rotation angle per second)
        var b1 = new Bodie(mousePos.x, mousePos.y, 13, 200, 6);
        bodies.push(b1);

        for (let i = 0; i < maxAsteroidCount; i++) {
            // Asteroid(pos.x , pos.y , element radius , orbit radius , rotation angle per second)
            b1.asteroids.push(new Asteroid(b1.orbitPos.x, b1.orbitPos.y, 5, 50, 111))
        }

    }
}

function resizeCanvas() {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    windowH = window.innerHeight;
    context.clearRect(0, 0, window.innerwidth, window.innerHeight)

    bodies = [];
    init();
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
      requestAnimationFrame(animate);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight)
   }
    
    for (var i = 0; i < bodies.length; i++) {
        bodies[i].orbit();
    }
}
let planetCount = 15;
let maxAsteroidCount = Math.random() * 4;

init();
animate();
