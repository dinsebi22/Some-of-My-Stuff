class PositionVec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
  }
}

class BoundingBox {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  contains(agent) {
    // Check if the agent is present inside the Boundry
    return (
      agent.x >= this.x &&
      agent.x <= this.x + this.width &&
      agent.y >= this.y &&
      agent.y <= this.y + this.height
    );
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "rgb(0,255,0)";
    ctx.stroke();
    ctx.closePath();
  }
}

class QuadTree {
  constructor(boundary) {
    this.quadTreeNodeCapacity = 4;
    this.boundary = boundary;
    this.agents = [];
    // Specifies if the grid was divided into the 4 quadrants
    this.divided = false;
  }

  insertInTree(agent) {
    // If the agent is not present inside the Grid we dont insert it
    if (!this.boundary.contains(agent)) {
      return;
    }

    // If the agent is present inside the grid and the capacity was not reached
    // Then we insert the element inside the grid
    if (this.agents.length < this.quadTreeNodeCapacity) {
      this.agents.push(agent);
    } else {
      // If the grid was not divided yet we split it into 4 quadrants NE,NW,SE,SW
      if (!this.divided) {
        this.subdivideTree();
      }

      //Otherwise we insert the agent in the respective subgrid
      this.northEast.insertInTree(agent);
      this.northWest.insertInTree(agent);
      this.southEast.insertInTree(agent);
      this.southWest.insertInTree(agent);
    }
  }

  subdivideTree() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let width = this.boundary.width;
    let height = this.boundary.height;

    let new_NE_Boundary = new BoundingBox(
      x + width / 2,
      y,
      width / 2,
      height / 2
    );
    this.northEast = new QuadTree(new_NE_Boundary);

    let new_NW_Boundary = new BoundingBox(x, y, width / 2, height / 2);
    this.northWest = new QuadTree(new_NW_Boundary);

    let new_SE_Boundary = new BoundingBox(
      x + width / 2,
      y + height / 2,
      width / 2,
      height / 2
    );
    this.southEast = new QuadTree(new_SE_Boundary);

    let new_SW_Boundary = new BoundingBox(
      x,
      y + height / 2,
      width / 2,
      height / 2
    );
    this.southWest = new QuadTree(new_SW_Boundary);

    this.divided = true;
  }

  draw(ctx) {
    this.boundary.draw(ctx);
    this.agents.forEach((agent) => agent.draw(ctx));
    if (this.divided) {
      this.northWest.draw(ctx);
      this.northEast.draw(ctx);
      this.southWest.draw(ctx);
      this.southEast.draw(ctx);
    }
  }
}

// Helpers

class PositionUtil {
  static getRandomPositionOnYAxis(boundingBox) {
    return boundingBox.y + Math.random() * boundingBox.height;
  }

  static getRandomPositionOnXAxis(boundingBox) {
    return boundingBox.x + Math.random() * boundingBox.width;
  }
}

export { QuadTree, BoundingBox, PositionVec2, PositionUtil };
