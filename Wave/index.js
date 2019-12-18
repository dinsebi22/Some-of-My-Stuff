let canvas = document.getElementById('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d')

let startTime = (new Date()).getTime();

const drawSin = (heightOffset, offset = 0, step = 0.1, color = '#c60003') => {
    let offsetX = offset
    return function () {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.lineWidth = 4

        ctx.moveTo(0, 300 + Math.sin(offsetX) * 30)
        for (let x = 0; x <= canvas.width; x++) {
            const y = Math.sin(x * 0.004 + offsetX) * 60 + heightOffset * 6;
            ctx.lineTo(x, canvas.height + 100 * 1.5 - grouth() + y)
        }
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.lineTo(0, 300 + Math.sin(offsetX) * 30)
        ctx.fill()
        offsetX += step
    }
}
let timeStop;
function grouth() {

    let currentTime = (new Date()).getTime();
    let passedTime = currentTime - startTime;
    if (passedTime / 1000 < 15) {
        timeStop = passedTime / 20;
        return passedTime / 20;
    } else {
        return timeStop;
    }

}
let sin1 = drawSin(42)
let sin2 = drawSin(40, 10, 0.04, '#DD0000')
let sin3 = drawSin(30, 10, 0.01, '#b00000')
let sin4 = drawSin(0, 10, 0.07, 'blue')
let sin5 = drawSin(10, 10, 0.1, 'green')

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    sin4()
    sin5();
    sin3()
    sin1()
    sin2()
    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)