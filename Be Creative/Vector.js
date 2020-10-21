class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  substract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  multiplyBy(multiplier) {
    this.x *= multiplier;
    this.y *= multiplier;
    return this;
  }

  divide(divisior) {
    this.x /= divisior;
    this.y /= divisior;
  }

  magnituedSquared() {
    return this.x * this.x + this.y * this.y;
  }

  magnitude() {
    return Math.sqrt(this.magnituedSquared());
  }

  distance(otherVector) {
    let copy = new Vector(this.x, this.y);
    copy.substract(otherVector);
    return copy.magnitude();
  }

  setMagnitude(newMag) {
    var magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.divide(magnitude);
    }
    this.multiplyBy(newMag);
  }

  limit(limit) {
    let magSquared = this.magnituedSquared();
    if (magSquared > limit * limit) {
      let divisior = Math.sqrt(magSquared);
      this.divide(divisior);
      this.multiplyBy(limit);
    }
  }

  normalize() {
    var magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.divide(magnitude);
    }
  }

  equal(otherV) {
    return this.x === otherV.x && this.y === otherV.y;
  }
}
