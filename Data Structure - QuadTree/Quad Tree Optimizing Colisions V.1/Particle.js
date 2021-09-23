export default class Particle {
  constructor(x, y, maxBounds) {
    this.x = x;
    this.y = y;
    this.dx = Math.random() > 0.5 ? 1 : -1;
    this.dy = Math.random() > 0.5 ? 1 : -1;
    this.radius = 4;
    this.maxBounds = maxBounds;
    this.highlight = false;
  }

  move(ctx) {
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

    this.draw(ctx);
  }

  // Returns true or false if two particles overlap
  intersects(other) {
    return (
      // Manhattan Distance
      Math.abs(this.x - other.x) + Math.abs(this.y - other.y) <
      this.radius + other.radius
    );
  }

  setHighlight(value) {
    this.highlight = value;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    // Change the color of the particle if it intersects with another
    if (this.highlight) {
      ctx.fillStyle = "#fff";
    } else {
      ctx.fillStyle = "#555";
    }
    ctx.fill();
    ctx.closePath();
  }
}
