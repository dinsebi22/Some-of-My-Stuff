let increment = 0.1;
let start = 0;
let scale = 30;
let columns = 0;
let rows = 0;

let particles = [];
let flowField;

let zOffset = 0;

function setup() {
    createCanvas(1500, 1200);
    console.log((width + scale))
    columns = floor(width / scale);
    rows = floor(height / scale);

    flowField = new Array(columns * rows);

    for (let i = 0; i < 2000; i++) {
        particles[i] = new Particle();
    }
    background(255);

}

function draw() {
    let yOffset = 0;
    for (let y = 0; y < rows; y++) {

        let xOffset = 0;
        for (let x = 0; x < columns; x++) {

            let index = (x + y * columns);
            let angle = noise(xOffset, yOffset, zOffset) * TWO_PI * 4;
            let v = p5.Vector.fromAngle(angle);
            v.setMag(54.5);
            flowField[index] = v;
            xOffset += increment;
        }
        yOffset += increment;
        zOffset += 0.0015;
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].follow(flowField);
        particles[i].update();
        particles[i].show();
        particles[i].edges();
        particles[i].color();


    }
}

function Particle() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 4;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.applyForce = function(force) {
        this.acceleration.add(force)
    }

    this.edges = function() {
        if (this.position.x > width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = width;
        if (this.position.y > height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = height;

    }

    this.follow = function(vectors) {
        let x = floor(this.position.x / scale);
        let y = floor(this.position.y / scale);
        let index = x + y * columns;
        let force = vectors[index];
        this.applyForce(force);
    }

    this.color = function() {
        let color = 4;
        switch (color) {
            case 0:
                stroke(255, 0, 0, 22);
                break;
            case 1:
                stroke(0, 255, 0, 22);
                break;
            case 2:
                stroke(0, 0, 255, 22);
                break;
            default:
                stroke(0, 0, 0, 22);
                break;

        }
    }

    this.show = function() {
        point(this.position.x, this.position.y)
        strokeWeight(2)
    }

}