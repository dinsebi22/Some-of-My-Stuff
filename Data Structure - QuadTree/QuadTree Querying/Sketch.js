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
let addedQuerySpace, searchBox, foundAgents;

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
  addedQuerySpace = false;
  boundary = new BoundingBox(...getCenterOfCanvas()); // Deconstruct the values of the getCenter function
  quadTree = new QuadTree(boundary);

  // Initialize Agents

  for (let i = 0; i < 1000; i++) {
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
  if (addedQuerySpace) {
    searchBox.draw(ctx);
    // Save the found Agents in a global variable for work afterwards
    foundAgents = quadTree.queryTree(searchBox, []);
    // Color the found Agents
    PositionUtil.colorQueriedAgents(foundAgents, "red");
  }

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

// Add Points while the mouse moves inside the Screen
// canvas.addEventListener("mousemove", (event) => {
//   let newAgent = new PositionVec2(event.x, event.y);
//   quadTree.insertInTree(newAgent);
// });

// Add a Search Space for which the Quarying is Done
canvas.addEventListener("mousemove", (event) => {
  // Color Back the previous Search and reinitialize the BoundingBox
  // And the foundAgents Array
  PositionUtil.clearPreviousSearch(searchBox, foundAgents);
  let width = 200;
  let height = 200;
  searchBox = new BoundingBox(
    event.x - width / 2,
    event.y - height / 2,
    width,
    height,
    "red" // Optional Property, otherwise Green
  );
  addedQuerySpace = true;
});
