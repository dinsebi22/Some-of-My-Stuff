var canvas, ctx, bars,
    y_end, bar_height, bar_width,
    frequency_array;
bars = 1300;
bar_width = window.innerWidth / bars;

function initPage() {
    audio = new Audio();
    context = new(window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    audio.src = "sciophobia.mp3"; // the source path
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frequency_array = new Uint8Array(analyser.frequencyBinCount);
    audio.play();
    animationLooper();
}

function animationLooper() {
    // set to the size of device
    canvas = document.getElementById("renderer");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");

    // style the background
    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(35, 7, 77, 0.2)");
    gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //draw a circle
    ctx.beginPath();

    analyser.getByteFrequencyData(frequency_array);
    increment = window.innerWidth / bars;
    x = 0;
    for (var i = 0; i < bars; i++) {
        //divide a circle into equal parts
        bar_height = frequency_array[i] * 3;
        // set coordinates

        y = window.innerHeight;
        y_end = y - bar_height;
        //draw a bar
        drawBar(x, y, y_end, bar_width, frequency_array[i]);
        x += increment + bar_width;
    }
    window.requestAnimationFrame(animationLooper);
}
// for drawing a bar
function drawBar(x1, y1, y2, width, frequency) {
    var lineColor = "rgb(" + frequency + ", " + frequency + ", " + 255 + ")";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1, y2);
    ctx.stroke();
}