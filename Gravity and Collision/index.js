let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas, ctx, points, size;
let Gravity, frictionFactor;
let box;
let isDraging = false;

function initForces() {
  Gravity = new Vector(0, 0.0981);
  frictionFactor = 0.01;
}

function init() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  size = 15;
  points = [];

  render();
}

class Point {
  constructor(x, y, size) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0.0001, 0.0001);
    this.size = size;
    this.mass = 2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, true);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }

  applyGravity() {
    let gravity = Gravity.get();
    gravity.multiplyBy(this.mass);
    this.velocity.add(gravity);
    this.velocity.setMagnitude(2)
  }

  applyFriction() {
    let friction = this.velocity.get();
    friction.multiplyBy(-1);
    friction.normalize();
    friction.multiplyBy(frictionFactor);
    this.velocity.add(friction);
  }

  update() {
    this.checkSpace();
    this.applyFriction();
    this.applyGravity();

    this.velocity.setMagnitude(2);
    this.position.add(this.velocity);
  }

  checkSpace() {

    let boxLimits = {
      x: (box.x + box.width - this.size),
      width_X: (box.x + this.size),
      y: (box.y + box.height - this.size),
      height_Y: (box.y + this.size)
    }

    if (this.position.x > boxLimits.x) {
      this.avoidEdges(100, this.velocity.y, 1);
    } else if (this.position.x < boxLimits.width_X) {
      this.avoidEdges(100, this.velocity.y, -1);
    }

    if (this.position.y > boxLimits.y) {
      this.avoidEdges(this.velocity.x, 100, 1);
    } else if (this.position.y < boxLimits.height_Y) {
      this.avoidEdges(this.velocity.x, 100, -1);
    }
  }


  avoidEdges(x, y, factor) {
    let desiredVelocity = new Vector(x * factor, y * factor);
    let mag = this.velocity.magnitude();
    let steer = new Vector(0, 0);
    steer.add(this.velocity);
    steer.substract(desiredVelocity);
    this.velocity.add(steer);
    this.velocity.setMagnitude(mag)
  }

}

function colision() {
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
      var dx = points[i].position.x - points[j].position.x;
      var dy = points[i].position.y - points[j].position.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (
        points[i] !== points[j] &&
        distance + 1 < points[i].size + points[j].size
      ) {
        var diference = new Vector(dx, dy);
        points[j].velocity.substract(diference);
      }
    }
  }
}

function render() {

  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  points.forEach((point) => {
    point.draw();
    point.update();
  });

  colision();
  drawBox(box)

  requestAnimationFrame(render);
}

function initpoints(count) {
  for (let i = 0; i < count; i++) {
    let x =
      box.x + (box.width - size) * Math.random();
    let y =
      box.y + (box.height - size) * Math.random();
    points.push(new Point(x, y, 7 + Math.floor(size * Math.random())));
  }
}

//////////////////////// Box

function initBox(width, height) {
  box = {
    x: window.innerWidth / 2 - width / 2,
    y: window.innerHeight / 2 - height / 2,
    width: width,
    height: height,
    rotation: 0
  }
}

function drawBox(box) {
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.width, box.height)
  ctx.lineWidth = 11;
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();
}

function checkIfResized() {
  return windowH !== window.innerHeight || windowW !== window.innerWidth
    ? true
    : false;
}

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  windowW = window.innerWidth;
  windowH = window.innerHeight;

  points = [];
  initBox(window.innerWidth / 1.3, window.innerHeight / 1.3);
  initpoints(300);
  render();
}



initBox(window.innerWidth / 1.3, window.innerHeight / 1.3);

initForces();
init();
initpoints(300);


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// addEventListeners();

function rotateBox() {
  ctx.beginPath();
  ctx.save();
  ctx.translate(box.x + box.width / 2, box.y + box.height / 2);
  ctx.rotate(box.rotation);
  ctx.rect(- box.width / 2, -box.height / 2, box.width, box.height);
  ctx.restore();
  ctx.lineWidth = 11;
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();
}

function addEventListeners() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // true for mobile device

    canvas.addEventListener("touchstart", (event) => {
      box.rotation -= (event.touches[0].clientX) / 50000;
      isDraging = true;
    });

    // Make the element appear on screen
    canvas.addEventListener("touchmove", (event) => {
      if (isDraging) {
        box.rotation -= (event.touches[0].clientX) / 50000;
      }
    });


    // Make the element appear on screen
    canvas.addEventListener("touchend", () => {
      if (isDraging) {
        isDraging = false;
      }
    });

  } else {
    // false for not mobile device
    canvas.addEventListener("mousedown", (event) => {
      box.rotation -= (event.offsetX) / 50000;
      isDraging = true;
    });

    // Make the element appear on screen
    canvas.addEventListener("mousemove", (event) => {
      if (isDraging) {
        box.rotation -= (event.offsetX) / 50000;
        console.log(box.rotation);
      }
    });

    canvas.addEventListener("mouseup", () => {
      if (isDraging) {
        isDraging = false;
      }
    });
  }
}
