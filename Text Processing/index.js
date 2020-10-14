let windowW = window.innerWidth;
let windowH = window.innerHeight;

let detail = 2;
let textSize = Math.floor((window.innerHeight * window.innerWidth) / 6000);

let canvas;
let ctx;
let textImageData;
let points;
let imageGrid;
let texts = ["Coding", "Adventure"];
let imgHeight = texts.length * textSize;
let topOffset = textSize / 5;

function initCtx() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
}

function drawText(texts) {
  let textCanvas = document.createElement("canvas");
  textCanvas.width = canvas.width;
  textCanvas.height = canvas.height;
  let textCtx = textCanvas.getContext("2d");

  for (let i = texts.length - 1; i >= 0; i--) {
    textCtx.font = "900 " + textSize + "px  Arial";
    textCtx.fillStyle = "red";
    textCtx.fillText(
      texts[i],
      window.innerWidth / 2 - (textSize * texts[i].length) / 3.2,
      textSize * (i + 1) - topOffset
    );
  }

  textImageData = textCtx.getImageData(0, 0, canvas.width, imgHeight);

  for (let y = 0; y < textImageData.height; y += detail) {
    let row = [];
    for (let x = 0; x < textImageData.width; x += detail) {
      const pixel = textImageData.data[(y * textImageData.width + x) * 4] / 255;
      row.push(pixel);
    }
    imageGrid.push(row);
  }
}

function init() {
  initCtx();

  points = [];
  imageGrid = [];

  drawText(texts);
  // Position Canvas
  canvas.style.paddingTop =
    (window.innerHeight - textImageData.height) / 2 + "px";

  initParticles(4000);

  render();
}

function initParticles(count) {
  for (let i = 0; i < count; i++) {
    points.push(
      new Particle(
        textImageData.width * Math.random(),
        textImageData.height * Math.random()
      )
    );
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.acceleration = 2;
    this.size = 2;
    this.color = "rgba(0,255,0 ," + this.size / 5 + ")";
  }

  move() {
    this.y += this.acceleration;

    if (this.y >= textImageData.height) {
      this.y = 0;
    }

    let value =
      imageGrid[Math.floor(this.y / detail)][Math.floor(this.x / detail)];
    if (value != 0) {
      this.acceleration = 2;
      this.size = 4;
    } else {
      this.acceleration = 4;
      this.size = 2;
    }
  }

  draw() {
    ctx.beginPath();
    // ctx.rect(this.x, this.y, this.size, this.size);
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function render() {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  // ctx.putImageData(textImageData, 0, 0);

  for (let i = 0; i < points.length; i++) {
    points[i].draw();
    points[i].move();
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

  textSize = Math.floor((window.innerWidth * window.innerHeight) / 6000);
  topOffset = textSize / 5;

  imgHeight = texts.length * textSize;

  init();
  render();
}
