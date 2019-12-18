
let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext('2d');

let startTime = (new Date()).getTime();

function passingOfTime() {
    let currentTime = (new Date()).getTime();
    let passedTime = currentTime - startTime;
    return passedTime/10000;
}

function randomPos() {
    return {
        x: (Math.random() * canvas.width),
        y: (Math.random() * canvas.height)
    }
}

function Particle(x, y, velocity, wiggle) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.size =this.velocity*2
    this.color = 'rgba(255,255,255,'+(0.4*this.size)+')';
    this.wiggle = wiggle;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, 2 * Math.PI);        
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    this.reset = function () {
        if (this.y > canvas.height + 5) {
            this.y = -10;
        }
        if (this.x > canvas.width + 5) {
            this.x = -10
        }
    }

    this.drop = function () {
        this.y += this.velocity * Math.abs(Math.sin(passingOfTime())+5);
        this.x += Math.abs(this.wiggle * Math.sin(passingOfTime()+5));
        this.reset();
    }

}

let snow = [];

function init() {
    for (let i = 0; i < 3000; i++) {
        let pos = randomPos();
        snow.push(new Particle(pos.x, pos.y, Math.random(), Math.random() ))
    }
}

init();

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < snow.length; i++) {
        snow[i].draw();
        snow[i].drop();
    }
}

animate();