let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let radius = 30;
let ctx = canvas.getContext('2d');


class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.growing = true;
        this.color = 'rgb('+(this.x/window.innerWidth * 255) +','
                           +(this.y/window.innerHeight * 255) +','
                           +((this.x/window.innerWidth + this.y/window.innerHeight) *255) +')';
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();
    }

    grow() {
        if (this.growing) {
            this.radius += 1;
        }
    }
    edges(){
        return (
            this.x + this.radius >= canvas.width ||
            this.x - this.radius <= 0 ||
            this.y + this.radius >= canvas.height ||
            this.y - this.radius <= 0
          );
    }

}

let circles = [];

function addNewCircle() {

    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let validCircle = true;
    
    for (let i = 0; i < circles.length; i++) {
        let distance = Math.sqrt( (x - circles[i].x) *(x - circles[i].x)  
                        + (y - circles[i].y)*(y - circles[i].y));
        if (distance -2 < circles[i].radius) {
            validCircle = false;
        }
    }

    if (validCircle) {
        circles.push(new Circle(x, y))
    }

}

let circleAddAttemps = 0;

function addMultipleCircles(){
    let total = 2;
    let count = 0;

    while(count < total){
        addNewCircle();
        count++;
    }
    
}


function doCheck(){
    for (let i = 0; i < circles.length; i++) {
        if(circles[i].growing){
            if(circles[i].edges()){
                circles[i].growing = false;
            }else{
                for (let j = 0; j < circles.length; j++) {
                    if(circles[i] != circles[j]){
                        let calcDistance =  Math.sqrt((circles[i].x - circles[j].x)*(circles[i].x - circles[j].x) +
                                            (circles[i].y - circles[j].y)*(circles[i].y - circles[j].y));
                       
                        if(calcDistance -1.5< circles[i].radius + circles[j].radius){
                            circles[i].growing = false;
                            break;
                        }
                    }
                }
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
    circles = [];

    requestAnimationFrame(animate);
}

function checkIfResized() {
    return (windowH !== window.innerHeight || windowW !== window.innerWidth) ? true : false;
}

requestAnimationFrame(animate)



function animate() {
    // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    if (checkIfResized()) {
        resizeCanvas();
        return;
    }

    addMultipleCircles();

    for (let i = 0; i < circles.length; i++) {
        
        doCheck();
        circles[i].draw();
        circles[i].grow();

    }


    requestAnimationFrame(animate)
}
