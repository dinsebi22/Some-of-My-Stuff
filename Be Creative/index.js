let canvas, ctx, letters, windowH, windowW, mouseLetter;
let isDraging = false;
let letterSpacingFactor = 1.2;
let charSize =
  (window.innerWidth + window.innerHeight) / 70 / letterSpacingFactor;
let param = {
  maxSpeed: 3,
  maxForce: 0.5,
};

function addEventListeners() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // true for mobile device

    canvas.addEventListener("touchstart", (event) => {
      mouseLetter.position.x = event.touches[0].clientX;
      mouseLetter.position.y = event.touches[0].clientY;
      isDraging = true;
    });

    // Make the element appear on screen
    canvas.addEventListener("touchmove", (event) => {
      if (isDraging) {
        mouseLetter.position.x = event.touches[0].clientX;
        mouseLetter.position.y = event.touches[0].clientY;
      }
    });

    // Make the element appear on screen
    canvas.addEventListener("touchend", (event) => {
      if (isDraging) {
        mouseLetter.position.x = 0;
        mouseLetter.position.y = 0;
        isDraging = false;
      }
    });
  } else {
    // false for not mobile device
    canvas.addEventListener("mousedown", (event) => {
      mouseLetter.position.x = event.x;
      mouseLetter.position.y = event.y;
      isDraging = true;
    });

    // Make the element appear on screen
    canvas.addEventListener("mousemove", (event) => {
      if (isDraging) {
        mouseLetter.position.x = event.offsetX;
        mouseLetter.position.y = event.offsetY;
      }
    });

    // Make the element appear on screen
    canvas.addEventListener("mouseup", (event) => {
      if (isDraging) {
        mouseLetter.position.x = 0;
        mouseLetter.position.y = 0;
        isDraging = false;
      }
    });
  }
}

function init() {
  windowH = window.innerHeight;
  windowW = window.innerWidth;

  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx = canvas.getContext("2d");

  initLetters();
  render();
}

function initLetters() {
  letters = [];
  let columnSpacing = 30;
  let rowSpacing = 5;

  let word = "BE CREATIVE".split("");
  let wordSize = word.length * (charSize / letterSpacingFactor) + columnSpacing; // Make characters closer

  // Columns and Rows count
  let columnCount = Math.floor(window.innerWidth / wordSize);
  let rowCount = Math.floor(window.innerHeight / (charSize + rowSpacing));

  // Spacing X , Y
  let spacingWidth =
    Math.floor(window.innerWidth - wordSize * columnCount + columnSpacing) / 2;
  let spacingHeight = Math.floor(
    window.innerHeight - (charSize + rowSpacing / 2) * rowCount
  );

  for (let k = 0; k < columnCount; k++) {
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < word.length; j++) {
        let x =
          spacingWidth + wordSize * k + j * (charSize / letterSpacingFactor);
        let y = (i + 1) * (charSize + rowSpacing / 2) + spacingHeight / 2;

        letters.push(
          new Letter(
            x,
            y,
            word[j],
            genColor(x / window.innerWidth, y / window.innerHeight)
          )
        );
      }
    }
  }

  mouseLetter = new Letter(0, 0);
  mouseLetter.value = "<>";
  mouseLetter.letterSize = 50;

  addEventListeners();
}

function genColor(x, y) {
  return (
    "rgb(" +
    0 +
    "," +
    (200 + ((x + y) / 2) * 255) +
    "," +
    (200 + (x - y) * 2 * 255) +
    ")"
  );
}

class Letter {
  constructor(x, y, value, color) {
    this.letterSize = charSize;
    this.value = value;
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.initialPosition = new Vector(x, y);
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.font = "900 " + this.letterSize + "px Arial";
    ctx.fillStyle = this.color;
    if (this.value === "I") {
      ctx.fillText(
        this.value,
        this.position.x + Math.sqrt(charSize),
        this.position.y
      );
    } else {
      ctx.fillText(this.value, this.position.x, this.position.y);
    }
    ctx.closePath();
  }

  move() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.multiplyBy(0);
  }

  moveBack() {
    if (!this.position.equal(this.initialPosition)) {
      let attractionValue = new Vector(
        this.initialPosition.x,
        this.initialPosition.y
      );
      let distance = attractionValue.distance(this.position);

      attractionValue.substract(this.position);
      attractionValue.substract(this.velocity);

      attractionValue.multiplyBy(this.mapFunc(distance, 0, 400, 0, 100));
      attractionValue.limit(1);
      this.velocity.add(attractionValue);
    }
  }

  mapFunc(value, min, max, newRangeMin, newRangeMax) {
    return (
      ((value - min) / (max - min)) * (newRangeMax - newRangeMin) + newRangeMin
    );
  }

  // moveBack() {
  //   if (!this.position.equal(this.initialPosition)) {
  //     let attractionValue = new Vector(0, 0);

  //     let diference = new Vector(
  //       this.initialPosition.x - this.position.x,
  //       this.initialPosition.y - this.position.y
  //     );
  //     let difMagnitude = diference.magnitude();
  //     attractionValue.add(diference);
  //     attractionValue.substract(this.velocity);
  //     attractionValue.multiplyBy(difMagnitude * 2);
  //     attractionValue.limit(1);
  //     this.velocity.add(attractionValue);
  //   }
  // }

  avoid() {
    let distance = this.position.distance(mouseLetter.position);

    if (
      mouseLetter.position.x > 0 &&
      mouseLetter.position.y > 0 &&
      distance < 300
    ) {
      let avoidenceValue = new Vector(0, 0);

      let diference = new Vector(
        this.position.x - mouseLetter.position.x,
        this.position.y - mouseLetter.position.y
      );
      diference.divide(distance * distance);
      avoidenceValue.add(diference);
      avoidenceValue.setMagnitude(param.maxSpeed * 2);
      avoidenceValue.substract(this.velocity);
      this.acceleration.add(avoidenceValue);
    }
  }
}

function doActions(letters) {
  letters.forEach((letter) => {
    letter.draw();
    letter.move();
    letter.moveBack();
    letter.avoid();
  });

  mouseLetter.draw();
}

init();

function render() {
  ctx.fillStyle = " rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  doActions(letters);

  requestAnimationFrame(render);
}

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
  initLetters();
  render();
}
