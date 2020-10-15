let windowW = window.innerWidth;
let windowH = window.innerHeight;

let detail = 2;
let textSize = Math.floor(window.innerWidth / 6.5);

let canvas;
let ctx;
let textImageData;
let points;
let imageGrid;
let texts = ["Colorfull", "Coding", "Adventure"];
let imgHeight = texts.length * textSize;
let topOffset = textSize / 1.5;

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
      textSize / 3.3,
      window.innerHeight / (texts.length + 1) + textSize * (i + 1) - topOffset
    );
  }

  textImageData = textCtx.getImageData(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

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

  initParticles(Math.floor(window.innerWidth));
  render();
}

function initParticles(count) {
  for (let i = 0; i < count; i++) {
    points.push(
      new Particle(
        window.innerWidth * Math.random(),
        window.innerHeight * Math.random()
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
    this.color = pickColor(Math.random());
  }

  move() {
    this.y += this.acceleration;

    if (this.y >= window.innerHeight) {
      this.y = 0;
    }
    this.x += this.acceleration;

    if (this.x >= window.innerWidth) {
      this.x = 0;
    }

    let value =
      imageGrid[Math.floor(this.y / detail)][Math.floor(this.x / detail)];
    if (value != 0) {
      this.acceleration = 2;
      this.size = 4;
    } else {
      this.acceleration = 4;
      this.size = 1;
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

function pickColor(num) {
  let colors = ["red", "white", "blue", "yellow", "pink"];
  return colors[Math.floor(num * (colors.length + 1))];
}

function render() {
  ctx.fillStyle = "rgba(0,0,0,0.041)";
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

  textSize = Math.floor(window.innerWidth / 6.5);
  topOffset = textSize / 1.5;

  imgHeight = texts.length * textSize;

  init();
  render();
}
