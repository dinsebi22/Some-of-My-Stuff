let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas;
let ctx;
let dots;
let radius = 3;
let margin = 12;
let connectionSpace = 40;
let bounceSpace = 22;

let mousePos = {
  x: undefined,
  y: undefined,
};
let maxRadius = 25;
let minRadius = radius;

window.addEventListener("mousemove", function (event) {
  mousePos.x = event.x;
  mousePos.y = event.y;
});

//Calculation for positioning and responsiveness
let dotCountX = Math.floor(
  (window.innerWidth - margin * 2) / ((radius * 2 + margin) * 2)
);
let dotCountY = Math.floor(
  (window.innerHeight - margin * 2) / ((radius * 2 + margin) * 2)
);
let offsetX =
  (radius * window.innerWidth) / 350 +
  (window.innerWidth % (dotCountX * (radius * 2 * 2 + margin * 2))) / 2;
let offsetY =
  (radius * window.innerWidth) / 350 +
  +((window.innerHeight % (dotCountY * (radius * 2 * 2 + margin * 2))) / 2);

function initCtx() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  dots = [];
}

function Dot(x, y, maxVals, speedX, speedY, reversed, radius) {
  this.x = x;
  this.y = y;
  this.maxVals = maxVals;
  this.speedX = speedX * reversed;
  this.speedY = speedY * reversed;
  this.radius = radius;

  this.color =
    "rgb(" +
    ((this.x / 2) % 255) +
    "," +
    ((this.y / 2) % 255) +
    "," +
    255 +
    ")";

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  };

  this.update = function () {
    if (!(this.radius > maxRadius - 3)) {
      if (
        this.x + this.radius > this.maxVals.maxRight ||
        this.x - this.radius < this.maxVals.maxLeft
      ) {
        this.speedX = -this.speedX;
      }

      if (
        this.y + this.radius > this.maxVals.maxBottom ||
        this.y - this.radius < this.maxVals.maxTop
      ) {
        this.speedY = -this.speedY;
      }

      this.x += this.speedX;
      this.y += this.speedY;
    }

    // interactivity: make circles larger
    if (
      mousePos.x - this.x < 50 &&
      mousePos.x - this.x > -50 &&
      mousePos.y - this.y < 50 &&
      mousePos.y - this.y > -50
    ) {
      if (this.radius < maxRadius) {
        this.radius += 3;
      }
    } else if (this.radius > minRadius) {
      this.radius -= 0.5;
    }

    this.draw();
  };

  this.connect = function (otherNode) {
    if (
      Math.abs(this.x - otherNode.x) < connectionSpace &&
      Math.abs(this.y - otherNode.y) < connectionSpace
    ) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(otherNode.x, otherNode.y);
      ctx.lineWidth = 0.2;
      ctx.strokeStyle = this.color;
      ctx.stroke();
      ctx.closePath();
    }
  };
}

function initDots(rows, columns) {
  let dotArray = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let x = i * (radius * 2 + margin) * 2 + offsetX;
      let y = j * (radius * 2 + margin) * 2 + offsetY;
      let maxVals = {
        maxTop: y - bounceSpace,
        maxBottom: y + bounceSpace,
        maxLeft: x - bounceSpace,
        maxRight: x + bounceSpace,
      };
      let speedX = Math.random();
      let speedY = Math.random();
      let reversed = Math.random() > 0.49 ? 1 : -1;

      dotArray.push(new Dot(x, y, maxVals, speedX, speedY, reversed, radius));
    }
  }
  return dotArray;
}

function init() {
  initCtx();
  dots = initDots(dotCountX, dotCountY);
  render();
}

function render(time) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].update();
    for (let j = 0; j < dots.length; j++) {
      dots[i].connect(dots[j]);
    }
  }

  requestAnimationFrame(render);
}

init();

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

  //Calculation for positioning and responsiveness
  dotCountX = Math.floor(
    (window.innerWidth - margin * 2) / ((radius * 2 + margin) * 2)
  );
  dotCountY = Math.floor(
    (window.innerHeight - margin * 2) / ((radius * 2 + margin) * 2)
  );
  offsetX =
    radius * 2 +
    (window.innerWidth % (dotCountX * (radius * 2 * 2 + margin * 2))) / 2;
  offsetY =
    radius * 2 +
    +((window.innerHeight % (dotCountY * (radius * 2 * 2 + margin * 2))) / 2);

  dots = initDots(dotCountX, dotCountY);

  render();
}
