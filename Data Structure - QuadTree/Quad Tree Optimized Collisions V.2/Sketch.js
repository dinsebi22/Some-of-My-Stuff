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
let agents = [];

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

  // Initialize Boundary
  boundary = new BoundingBox(...getCenterOfCanvas()); // Deconstruct the values of the getCenter function

  // Initialize Agents
  for (let i = 0; i < 1500; i++) {
    let agent = new PositionVec2(
      PositionUtil.getRandomPositionOnXAxis(boundary),
      PositionUtil.getRandomPositionOnYAxis(boundary),
      boundary
    );
    agents.push(agent);
  }

  render();
}

function render() {
  if (checkIfResize()) {
    resizeCanvas();
    return;
  }

  // At each Draw frame reinitialize the quadTree
  quadTree = new QuadTree(boundary);

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const agent of agents) {
    agent.move();
    agent.draw(ctx);
    agent.highlight(false);
  }

  // and insert again all the points after they move
  for (const agent of agents) {
    quadTree.insertInTree(agent);

    let agentRange = new BoundingBox(
      agent.x - agent.radius,
      agent.y - agent.radius,
      agent.radius * 2,
      agent.radius * 2
    );
    agentRange.draw(ctx);

    let neighbours = quadTree.queryTree(agentRange, []);
    for (const neighbour of neighbours) {
      if (agent !== neighbour && agent.intersectsOther(neighbour)) {
        agent.highlight(true);
        neighbour.highlight(true);
        break;
      }
    }
  }

  quadTree.draw(ctx);

  requestAnimationFrame(render);
}

/////////////////////////////////////////////

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
