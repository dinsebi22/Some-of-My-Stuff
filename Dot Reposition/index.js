let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas;
let ctx;
let dots;
let radius = 30;
let margin = 8;
let nextPositions;

//Calculation for positioning and responsiveness
let dotCountX = Math.floor(
  (window.innerWidth - margin * 2) / ((radius + margin) * 2)
);
let dotCountY = Math.floor(
  (window.innerHeight - margin * 2) / ((radius + margin) * 2)
);
let offsetX =
  radius + (window.innerWidth % (dotCountX * (radius * 2 + margin * 2))) / 2;
let offsetY =
  radius +
  +((window.innerHeight % (dotCountY * (radius * 2 + margin * 2))) / 2);

function initCtx() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  dots = [];
  nextPositions = [];
}

function Dot(x, y) {
  this.x = x;
  this.y = y;
  this.nextX;
  this.nextY;

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  };
}

function initDots(rows, columns) {
  let dotArray = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      dotArray.push(
        new Dot(
          i * (radius + margin) * 2 + offsetX,
          j * (radius + margin) * 2 + offsetY
        )
      );
    }
  }
  return dotArray;
}

function calculateNewPositions() {
  nextPositions = [];
  let positions = initDots(dotCountX, dotCountY);
  for (let i = positions.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
}

function init() {
  initCtx();
  dots = initDots(dotCountX, dotCountY);
  nextPositions = calculateNewPositions();
  render();
}

function moveToNextPosition(oldPos, nextPos) {
  if (oldPos.x < nextPos.x) {
    oldPos.x += 1;
  } else if (oldPos.x > nextPos.x) {
    oldPos.x -= 1;
  }

  if (oldPos.y < nextPos.y) {
    oldPos.y += 1;
  } else if (oldPos.y > nextPos.y) {
    oldPos.y -= 1;
  }
}
let timeCount = 0;

function render(time) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].draw();
    if (timeCount > window.innerWidth / 10) {
      for (let j = 0; j < 5; j++) {
        moveToNextPosition(dots[i], nextPositions[i]);
      }
    }
    if (timeCount % Math.floor(window.innerWidth / 3) === 0) {
      nextPositions = calculateNewPositions();
    }
  }
  timeCount++;

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
    (window.innerWidth - margin * 2) / ((radius + margin) * 2)
  );
  dotCountY = Math.floor(
    (window.innerHeight - margin * 2) / ((radius + margin) * 2)
  );
  offsetX =
    radius + (window.innerWidth % (dotCountX * (radius * 2 + margin * 2))) / 2;
  offsetY =
    radius +
    +((window.innerHeight % (dotCountY * (radius * 2 + margin * 2))) / 2);
  timeCount = 0;

  dots = initDots(dotCountX, dotCountY);
  nextPositions = calculateNewPositions();

  render();
}
