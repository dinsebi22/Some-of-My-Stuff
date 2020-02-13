const canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

class Cell {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }
}

function generateGrid(xCount, yCount) {
    var cellWidth = (window.innerWidth / xCount);
    var cellHeight = (window.innerHeight / yCount);

    var posX = 0;
    var posY = 0;

    let grid = [];
    for (let y = 0; y < yCount; y++) {
        let row = [];
        for (let x = 0; x < xCount; x++) {
            row.push(new Cell(posX, posY, cellWidth, cellHeight, 'white'));
            posX += cellWidth;

        }
        grid.push(row);
        posY += cellHeight;
        posX = 0;
    }
    return grid;
}


let grid = generateGrid(70, 70);

class Ant {
    constructor(i, j, rotation) {
        this.i = i;
        this.j = j;
        this.cell = grid[i][j]
        this.rotation = rotation;
    }

    move() {
        if (grid[this.i][this.j].color == "white") {
            grid[this.i][this.j].color = "black"
            this.rotate(this.rotation + 90, 90)


        } else if (grid[this.i][this.j].color == "black") {
            grid[this.i][this.j].color = "white";
            this.rotate(this.rotation - 90, -90)
        }

    }

    rotate(rotation, angle) {
        rotation = rotation % 360;
        switch (rotation) {
            case 0:
                this.j += 1;
                break;
            case 90:
                this.i += 1;
                break;
            case 180:
                this.j -= 1;
                break;
            case 270:
                this.i -= 1;
                break;
        }
        this.rotation += angle;
    }

}


let ant = new Ant(grid.length / 2, grid[0].length / 2, 0)


function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].draw();
        }
    }

    for (let i = 0; i < 10; i++) {
        ant.move()
        if (ant.i < 0) {
            return;
        }
    }
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate);