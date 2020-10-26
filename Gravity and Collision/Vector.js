class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get() {
    return new Vector(this.x, this.y);
  }

  set(val) {
    this.x = val.x;
    this.y = val.y;
  }

  add(otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
    return this;
  }

  substract(otherVector) {
    this.x -= otherVector.x;
    this.y -= otherVector.y;
    return this;
  }

  multiplyBy(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  divideBy(factor) {
    this.x /= factor;
    this.y /= factor;
    return this;
  }

  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSquared());
  }

  setMagnitude(factor) {
    let magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.divideBy(magnitude);
      this.multiplyBy(factor);
    }
    return this;
  }

  limit(limit) {
    let magnitudeSquare = this.magnitudeSquared();
    if (magnitudeSquare > limit * limit) {
      let magnitude = Math.sqrt(this.magnitudeSquared);
      this.divideBy(magnitude);
      this.multiplyBy(limit);
    }
    return this;
  }

  distance(otherVector) {
    let copy = new Vector(this.x, this.y);
    copy.substract(otherVector);
    return copy.magnitude();
  }

  normalize() {
    let magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.divideBy(magnitude);
    }
    return this;
  }
}
