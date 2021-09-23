import {
  BoundingBox,
  QuadTree,
  PositionVec2,
  PositionUtil,
} from "./QuadTreeStructure.js";

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

let canvas, ctx;
let boundary, quadTree;

function getCenterOfCanvas() {
  let spacingWidth = 100;
  let spacingHeight = 100;

  let widthSpace = window.innerWidth - spacingWidth * 2;
  let heightSpace = window.innerHeight - spacingHeight * 2;

  // Use "...getCenterOfCanvas() -> to Deconstruct the list of values"
  return [spacingHeight, spacingWidth, widthSpace, heightSpace];
}

function initialize() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  // Initialize State
  boundary = new BoundingBox(...getCenterOfCanvas()); // Deconstruct the values of the getCenter function
  quadTree = new QuadTree(boundary);

  // Initialize Agents

  for (let i = 0; i < 200; i++) {
    let agent = new PositionVec2(
      PositionUtil.getRandomPositionOnXAxis(boundary),
      PositionUtil.getRandomPositionOnYAxis(boundary)
    );
    quadTree.insertInTree(agent);
  }

  render();
}

function render() {
  if (checkIfResize()) {
    resizeCanvas();
    return;
  }
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  quadTree.draw(ctx);

  requestAnimationFrame(render);
}

function checkIfResize() {
  return (
    windowHeight !== window.innerHeight || windowWidth !== window.innerWidth
  );
}

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;

  boundary = undefined;
  quadTree = undefined;

  initialize();
  render();
}

initialize();

// canvas.addEventListener("mousemove", (event) => {
//   let newAgent = new PositionVec2(event.x, event.y);
//   quadTree.insertInTree(newAgent);
// });
