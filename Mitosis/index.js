let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas;
let ctx;
let dots;
let radius = 4;

function initCtx() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
}

function Dot(x, y, radius, maxCritMass) {
  this.x = x;
  this.y = y;
  this.criticalMass = 0;
  this.radius = radius;
  this.maxCritMass = maxCritMass;
  this.maxRadius = radius * 2;

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle =
      "rgb(" +
      (((Math.abs(window.innerWidth / 2 - this.x) +
        Math.abs(window.innerHeight / 2 - this.y) +
        400) /
        4) %
        255) +
      ",0,0)";
    ctx.strokeStyle = "red";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  };

  this.shake = function () {
    let signX = pickBetweenTwoValues(-1, 1);
    let signY = pickBetweenTwoValues(-1, 1);
    this.x += (Math.random() / 5) * signX;
    this.y += (Math.random() / 5) * signY;
    this.criticalMass += Math.random() * 0.5;
    this.growth();
  };

  this.growth = function () {
    if (this.radius < this.maxRadius) {
      this.radius += 0.1;
    }
  };

  this.connect = function (otherCell) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(otherCell.x, otherCell.y);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.4;

    ctx.stroke();
    ctx.closePath();
  };

  this.split = function () {
    if (this.criticalMass > this.maxCritMass) {
      dots.push(new Dot(this.x, this.y, radius, this.maxCritMass + 1));
      dots.push(new Dot(this.x, this.y, radius, this.maxCritMass + 1));
      let index = dots.indexOf(this);
      dots.splice(index, 1);
      this.criticalMass = 0;
    }
  };
}

function pickBetweenTwoValues(valOne, valTwo) {
  return parseInt(Math.random() * 2) ? valOne : valTwo;
}

function init() {
  dots = [];
  dots.push(new Dot(window.innerWidth / 2, window.innerHeight / 2, radius, 5));
  render();
}

function separate() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = 0; j < dots.length; j++) {
      if (i != j) {
        let calcDistance =
          Math.abs(dots[i].x - dots[j].x) + Math.abs(dots[i].y - dots[j].y);

        if (calcDistance < dots[i].radius * 2 - 1) {
          let signX = pickBetweenTwoValues(-1, 1);
          let signY = pickBetweenTwoValues(-1, 1);

          dots[i].x += 2 * radius * signX;
          dots[i].y += 2 * radius * signY;

          dots[i].connect(dots[j]);
        }
      }
    }
  }
}

function render(time) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  dots.forEach((dot) => {
    dot.draw();
    dot.shake();
    if (dots.length < 500) {
      dot.split();
    }
  });
  separate();

  requestAnimationFrame(render);
}

initCtx();
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
  init();
}
