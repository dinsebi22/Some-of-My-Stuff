let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let canvasCenterX = window.innerWidth / 2;
let canvasCenterY = window.innerHeight / 2;

let startTime = (new Date()).getTime();

let circles = [];

let offset = 0;

function Dot(x, y, radius, centerOffset, radialAngleOnCircle, multiplier, maxGrouth, connectionLineWidth, rotationSpeed) {

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.centerOffset = centerOffset;
    this.radialAngleOnCircle = radialAngleOnCircle
    this.count = undefined;
    const initialCenterOffset = centerOffset;
    this.growing = true;
    this.isConnected = false;
    this.connectionLineWidth = connectionLineWidth;

    this.multiplier = multiplier;
    this.maxGrouth = maxGrouth;
    this.rotationSpeed = rotationSpeed;

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
        ctx.lineWidth = this.connectionLineWidth;
        ctx.strokeStyle = "white"
        ctx.closePath();
        ctx.stroke();
    }

    this.roatate = function() {
        let interval = Math.PI * 2 / this.count;
        let currentTime = (new Date()).getTime();
        let passedTime = currentTime - startTime;

        this.x = canvasCenterX + this.centerOffset * Math.cos(((passedTime) / 100000 * this.rotationSpeed) + offset);
        this.y = canvasCenterY + this.centerOffset * Math.sin(((passedTime) / 100000 * this.rotationSpeed) + offset);

        //The interval is verrrrrrrry important
        offset += interval;

    }

    this.shift = function() {
        let currentTime = (new Date()).getTime();
        let passedTime = currentTime - startTime;

        if (this.growing && this.centerOffset < initialCenterOffset + this.maxGrouth) {
            this.centerOffset += Math.abs(Math.sin(passedTime)) * Math.random() * this.multiplier;
            if (this.centerOffset > initialCenterOffset + this.maxGrouth) {
                this.growing = false;
            }
        } else {
            this.centerOffset -= Math.abs(Math.sin(passedTime)) * Math.random() * this.multiplier;
            if (this.centerOffset <= initialCenterOffset) {
                this.growing = true;
            }
        }
    }
}


function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    windowW = window.innerWidth;
    windowH = window.innerHeight;
    ctx.clearRect(0, 0, window.innerwidth, window.innerHeight)
   
   canvasCenterX = windowW / 2;
   canvasCenterY = windowH / 2;
   
    circles = [];
    initDotCircle(4, 350, 400, 1, 14, 70, 0.9, 25, 0.7);
}

function checkIfResized() {
    return (windowH !== window.innerHeight || windowW !== window.innerWidth) ? true : false;
}


function animate() {
   if (checkIfResized()) {
        resizeCanvas();
        return;
    }else{
         ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
         requestAnimationFrame(animate);
    }

    for (let i = 0; i < circles.length; i++) {
        for (let j = 0; j < circles[i].length; j++) {
            circles[i][j].draw();
            circles[i][j].roatate();
            circles[i][j].shift();
        }
    }

    for (let i = 0; i < circles.length - 1; i++) {
        for (let j = 0; j < circles[i].length; j++) {
            // Connecting each circle of dots to the one inside it
            circles[i][j].connect(circles[i + 1][j]);
        }
    }

    // //Connect each dot to next one
    for (let i = 0; i < circles.length - 1; i++) {
        for (let j = 0; j < circles[i].length - 1; j++) {
            if (circles[i][j].isConnected && circles[i][j + 1].isConnected) {
                //Connecting each Dot to the next one
                circles[i][j].connect(circles[i][j + 1]);
                //Connecting the last to the first Dot
                if (j + 1 === circles[i].length - 1) circles[i][j + 1].connect(circles[i][0]);
            }
        }
    }

}

function initDotCircle(circleCount, dotCount, maxDistFromCenter, radius, multiplier, maxGrouth, connectionLineWidth, rotationSpeed, chanceToConnect) {

    let interval = Math.PI * 2 / dotCount;
    let centerOffset = 0;
    for (let i = 0; i < circleCount; i++) {
        //Circle array of dots to be added to the 'circles' array
        let newArr = [];
        centerOffset += maxDistFromCenter / circleCount;
        for (let j = 0; j < dotCount; j++) {
            // Initializing each Position x ,y
            let xPos = canvasCenterX + centerOffset * Math.cos(interval);
            let yPos = canvasCenterY + centerOffset * Math.sin(interval);

            let isConnected = Math.random();
            newArr.push(new Dot(xPos, yPos, radius, centerOffset, interval, multiplier, maxGrouth, connectionLineWidth, rotationSpeed))
            newArr[j].count = dotCount;

            // Deciding if the connection is made between dots
            if (isConnected > 1 - chanceToConnect) {
                newArr[j].isConnected = true;
            }
        }

        //Adding the circle of dots array to the 'circle' array
        circles.push(newArr);
    }

    animate();

}



//Outer Ring Initialization
initDotCircle(4, 350, 400, 1, 14, 70, 0.9, 25, 0.7);
