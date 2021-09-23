class PositionVec2 {
  constructor(x, y, maxBounds) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    // Boudary of the Points
    this.maxBounds = maxBounds;
    // Movement Speed
    this.dx = Math.random() > 0.499 ? 1 : -1;
    this.dy = Math.random() < 0.499 ? 1 : -1;
    this.isHighlighted = false;
    this.boundarySpace = null;
  }

  highlight(value) {
    this.isHighlighted = value;
  }

  intersectsOther(other) {
    return (
      Math.abs(this.x - other.x) + Math.abs(this.y - other.y) <
      this.radius + other.radius
    );
  }

  move() {
    if (
      this.x + this.radius > this.maxBounds.x + this.maxBounds.width ||
      this.x - this.radius < this.maxBounds.x
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y + this.radius > this.maxBounds.y + this.maxBounds.height ||
      this.y - this.radius < this.maxBounds.y
    ) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    if (this.isHighlighted) {
      ctx.fillStyle = "#fff";
    } else {
      ctx.fillStyle = "#333";
    }
    ctx.fill();
    ctx.closePath();
  }
}

class BoundingBox {
  constructor(x, y, width, height, color) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    // Optional Property, otherwise Green
    this.color = color || "rgb(0, 255, 0)";
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

  intersects(range) {
    let l1 = { x: this.x, y: this.y };
    let l2 = { x: range.x, y: range.y };
    let r1 = { x: this.x + this.width, y: this.y + this.height };
    let r2 = { x: range.x + range.width, y: range.y + range.height };
    // Check if 2 sqares intersect
    return l1.x >= r2.x || l2.x >= r1.x || r1.y >= l2.y || r2.y >= l1.y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = this.color;
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
      agent.boundarySpace = this.boundary;
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

  queryTree(range, found) {
    // If the squares dont intersect
    if (!this.boundary.intersects(range)) {
      // Empty array
      return;
    } else {
      // If the Squares Intersect
      for (const agent of this.agents) {
        // Then check all the agents inside the overlaping squares
        // If they are contained inside the queryRange then
        // add them to the found Array
        if (range.contains(agent)) {
          found.push(agent);
        }
      }

      // If the current QuadTree was divided call the
      // querryTree function for the 4 quadrants of the QuadTree
      if (this.divided) {
        this.northWest.queryTree(range, found);
        this.northEast.queryTree(range, found);
        this.southWest.queryTree(range, found);
        this.southEast.queryTree(range, found);
      }
      // Return the final found agents
      return found;
    }
  }

  draw(ctx) {
    this.boundary.draw(ctx);
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
    return (
      boundingBox.y +
      (Math.random() * boundingBox.height +
        Math.random() * boundingBox.height) /
        2
    );
  }

  static getRandomPositionOnXAxis(boundingBox) {
    return (
      boundingBox.x +
      (Math.random() * boundingBox.width + Math.random() * boundingBox.width) /
        2
    );
  }
}

export { QuadTree, BoundingBox, PositionVec2, PositionUtil };
