import Particle from "./Particle.js";
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
let particles = [];

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

  // Initialize Particles
  for (let i = 0; i < 2000; i++) {
    particles[i] = new Particle(
      PositionUtil.getRandomPositionOnXAxis(boundary),
      PositionUtil.getRandomPositionOnYAxis(boundary),
      boundary
    );
  }

  render();
}

function render() {
  if (checkIfResize()) {
    resizeCanvas();
    return;
  }
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Recreate the QuadTree each draw
  quadTree = new QuadTree(boundary);

  for (const particle of particles) {
    particle.move(ctx);
    // Se the value of the particle to be not Highlighted
    particle.setHighlight(false);
  }

  // Collision Loop
  for (const particle of particles) {
    // We create a point with the x, y values of the Particle
    // also referencing the Particle itself
    let pointVal = new PositionVec2(particle.x, particle.y, particle);
    quadTree.insertInTree(pointVal);

    // Instead of looking at every other particle inside the space we would like to QUERRY
    // We define the Range
    let range = new BoundingBox(
      particle.x - particle.radius,
      particle.y - particle.radius,
      particle.radius * 2,
      particle.radius * 2
    );

    let points = quadTree.queryTree(range, []);
    range.draw(ctx);

    for (const point of points) {
      // Get the userData from the Point;
      let other = point.userData;
      // Check particles overlape and set the value of highlighted value to true
      if (particle !== other && particle.intersects(other)) {
        particle.setHighlight(true);
      }
    }
  }

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

// canvas.addEventListener("mouseove", (event) => {
//   let newAgent = new PositionVec2(event.x, event.y);
//   quadTree.insertInTree(newAgent);
// });
