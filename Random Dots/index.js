let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

let dots = [];

function Dot(x, y, dotSize, color, maxSteps) {
    this.x = x;
    this.y = y;
    this.dotSize = dotSize;
    this.maxSteps = Math.floor(Math.random() * maxSteps);
    this.stepsMade = 0;
    this.color = color;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.dotSize, 0, Math.PI * 2);
        // Assuming your canvas element is ctx
        ctx.shadowColor = "rgba(0, 255, 0, 0.06)" // string
        ctx.shadowBlur = 15; // integer
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    this.changeDirection = function() {
        let directionId = Math.floor(Math.random() * 4)
        switch (directionId) {
            case 0:
                return "up";
            case 1:
                return "down";
            case 2:
                return "left";
            case 3:
                return "right";
        }
    }

    this.shouldChangeDir = function(prevDir) {
        let newDir = this.changeDirection();
        if (this.x <= 0 || this.x >= window.innerWidth || this.y <= 0 || this.y >= window.innerHeight) {
            while (newDir === prevDir) {
                newDir = this.changeDirection();
            }
            this.direction = newDir;
            this.maxSteps = 0;
        }
    }

    this.direction = this.changeDirection();
    this.move = function() {
        let speed = 3;
        if (this.maxSteps >= this.stepsMade) {

            if (this.direction === 'up' && this.y - speed > 0) {
                this.y -= speed;
            } else
            if (this.direction === 'down' && this.y + speed < window.innerHeight - this.dotSize) {
                this.y += speed;
            } else
            if (this.direction === 'left' && this.x - speed > 0) {
                this.x -= speed;
            } else
            if (this.direction === 'right' && this.x + speed < window.innerWidth - this.dotSize) {
                this.x += speed;
            } else {
                this.shouldChangeDir(this.direction);
            }
            this.stepsMade++;
        } else {
            this.direction = this.changeDirection();
            this.stepsMade = 0;
        }
    }
    this.update = function() {
        this.move();
    }
}



function animate() {
    requestAnimationFrame(animate);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.09)'
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < dots.length; i++) {
        dots[i].draw();
        dots[i].update();
    }
}



function init(dotCount, dotSize) {
    let dotsW = (window.innerWidth) / dotCount;
    let dotsH = (window.innerHeight) / dotCount;

    let offsetX = 0;
    let offsetY = 0;
    for (let i = 0; i < dotCount; i++) {
        //Horizontal
        dots.push(new Dot(offsetX, 0, dotSize, 'green', 30));
        dots.push(new Dot(offsetX, window.innerHeight - dotSize, dotSize, 'green', 30));

        //Increment
        offsetX += dotsW;
        // offsetY += dotsH;
    }
    dots.push(new Dot(offsetX - dotSize, 0, dotSize, 'green', 30));
    dots.push(new Dot(offsetX - dotSize, window.innerHeight - dotSize, dotSize, 'green', 30));


    offsetX = 0 + dotsW;
    offsetY = 0 + dotsH;
    for (let i = 0; i < dotCount - 1; i++) {
        //Vertical
        dots.push(new Dot(0, offsetY, dotSize, 'green', 30));
        dots.push(new Dot(window.innerWidth - dotSize, offsetY, dotSize, 'green', 30));

        //Increment
        offsetX += dotsW;
        offsetY += dotsH;
    }
}

init(122, 5)

animate();