let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas;
let ctx;
let cells;
let radius = 4;
let speed = 1;

function initCtx() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
}

function Cell(x, y, radius, stepsX, stepsY) {
  this.x = x;
  this.y = y;
  this.stepsX = stepsX * pickBetweenTwoValues(-1, 1);
  this.stepsY = stepsY * pickBetweenTwoValues(-1, 1);
  this.radius = radius;

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  };

  this.move = function () {
    // if (this.x + this.radius > innerWidth + 0 || this.x - this.radius < -0) {
    //   this.stepsX = -this.stepsX;
    // }

    // if (this.y + this.radius > innerHeight + 0 || this.y - this.radius < -0) {
    //   this.stepsY = -this.stepsY;
    // }
    if (this.x + this.radius > innerWidth + this.radius * 2) {
      this.x = this.radius;
    } else if (this.x - this.radius < 0 - this.radius * 2) {
      this.x = window.innerWidth - this.radius;
    }

    if (this.y + this.radius > innerHeight + this.radius * 2) {
      this.y = this.radius;
    } else if (this.y - this.radius < 0 - this.radius * 2) {
      this.y = window.innerHeight - this.radius;
    }

    this.x += this.stepsX;
    this.y += this.stepsY;
  };

  this.eat = function (otherCell) {
    this.radius += otherCell.radius;
    let index = cells.indexOf(otherCell);
    cells.splice(index, 1);

    this.split();
  };

  this.split = function () {
    if (this.radius > radius * 4) {
      for (let i = 0; i < this.radius / radius; i++) {
        cells.push(
          new Cell(
            this.x + i * radius * 2,
            this.y + i * radius * 2,
            radius,
            speed,
            speed
          )
        );
      }

      let index = cells.indexOf(this);
      cells.splice(index, 1);
    }
  };
}

function pickBetweenTwoValues(valOne, valTwo) {
  return parseInt(Math.random() * 2) ? valOne : valTwo;
}

function init() {
  cells = [];
  initInitialCells(300, cells);
  render();
}

function initInitialCells(count, array) {
  for (let i = 0; i < count; i++) {
    let posX = window.innerWidth * Math.random();
    let posY = window.innerHeight * Math.random();
    array.push(new Cell(posX, posY, radius, speed, speed));
  }
}

function detectCollision() {
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells.length; j++) {
      //////////
      if (i != j && cells[i] != undefined && cells[j] != undefined) {
        var dx = cells[i].x - cells[j].x;
        var dy = cells[i].y - cells[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (cells[i].radius + cells[j].radius) / 1.2) {
          if (cells[i].radius >= cells[j].radius) {
            cells[i].eat(cells[j]);
          } else {
            cells[j].eat(cells[i]);
          }
        }
      }
      //////////
    }
  }
}

function render() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  cells.forEach((cell) => {
    cell.draw();
    cell.move();
  });

  detectCollision();

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
