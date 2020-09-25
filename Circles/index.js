let windowW = window.innerWidth;
let windowH = window.innerHeight;
let startTime = new Date().getTime();

let canvas;
let ctx;
let circles;

let radius = 80;
let margin = 8;
let innerCirclesCount = 10;
let circle;
let acceleration = 0.01;

//Calculation for positioning and responsiveness
let circleCountX = Math.floor(
  (window.innerWidth - margin * 2) / ((radius + margin) * 2)
);
let circleCountY = Math.floor(
  (window.innerHeight - margin * 2) / ((radius + margin) * 2)
);
let offsetX =
  radius + (window.innerWidth % (circleCountX * (radius * 2 + margin * 2))) / 2;
let offsetY =
  radius +
  +((window.innerHeight % (circleCountY * (radius * 2 + margin * 2))) / 2);

function initCtx() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  circles = [];
}

function Circle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.integrity = 2 * Math.random();
  this.radians = (Math.PI / 180) * (this.integrity * 3);
  this.rotation = 0;
  this.accelerate = true;

  this.draw = function () {
    this.rotation += this.radians + this.integrity / 100;

    // Rotate Object in Place around own axis
    // Rotate Object in Place around own axis
    // Rotate Object in Place around own axis
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    // ctx.scale(this.rotation % 2, this.rotation % 2);
    ctx.arc(0, 0, this.radius, 0, this.integrity * Math.PI);
    ctx.restore();

    // Rotate Object in Place around own axis
    // Rotate Object in Place around own axis
    // Rotate Object in Place around own axis

    ctx.lineWidth = 7;
    ctx.strokeStyle =
      "rgb(" +
      (this.integrity % 255) / 2 +
      "," +
      (this.integrity * 255) / 2 +
      "," +
      (this.integrity * 255) / 2 +
      ")";
    ctx.stroke();
    ctx.closePath();
  };
}

function initCircleArray(rows, columns, innerCirclesCount) {
  for (let i = 0; i < rows; i++) {
    let circleRow = [];
    for (let j = 0; j < columns; j++) {
      let innerCircles = [];
      for (let k = 0; k < innerCirclesCount; k++) {
        innerCircles.push(
          new Circle(
            offsetX + i * (radius + margin) * 2,
            offsetY + j * (radius + margin) * 2,
            radius - k * 7.5
          )
        );
      }
      circleRow.push(innerCircles);
    }
    circles.push(circleRow);
  }
}

function init() {
  initCtx();
  initCircleArray(circleCountX, circleCountY, innerCirclesCount);
  render();
}

function render(time) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  for (let i = 0; i < circles.length; i++) {
    for (let j = 0; j < circles[i].length; j++) {
      for (let k = 0; k < circles[i][j].length; k++) {
        circles[i][j][k].draw();
      }
    }
  }
  requestAnimationFrame(render);
}

init();
console.log(circles);

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

  circles = [];
  circleCountX = Math.floor(
    (window.innerWidth - margin * 2) / ((radius + margin) * 2)
  );
  circleCountY = Math.floor(
    (window.innerHeight - margin * 2) / ((radius + margin) * 2)
  );
  offsetX =
    radius +
    (window.innerWidth % (circleCountX * (radius * 2 + margin * 2))) / 2;
  offsetY =
    radius +
    +((window.innerHeight % (circleCountY * (radius * 2 + margin * 2))) / 2);
  initCircleArray(circleCountX, circleCountY, 10);

  requestAnimationFrame(render);
}
