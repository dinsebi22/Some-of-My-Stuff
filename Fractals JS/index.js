var c = document.getElementById("canvasFractals");
var iterations = document.getElementById("iterations");
var redoStuff = document.getElementById("redoStuff");
c.width = window.innerWidth;
c.height = window.innerHeight;
var context = c.getContext("2d");

var magFactor = 400;
var panX = 2;
var panY = 1.5;

var iter = 1;
setInterval(function() {
    context.clearRect(0, 0, c.width, c.height);
    doEverithing(iter);
    iter += 5;
}, 1100);

function doEverithing(maxIter) {
    for (var x = 0; x < c.height; x++) {
        for (var y = 0; y < c.width; y++) {
            var isPartOfSet = MandelbrotSetVerification(x / magFactor - panX, y / magFactor - panY);

            if (isPartOfSet == 0) {
                context.fillStyle = '#000';
                context.fillRect(x, y, 1, 1); // Draw a black pixel
            } else {
                context.fillStyle = 'hsl(0, 100%, ' + isPartOfSet + '%)';
                context.fillRect(x, y, 1, 1); // Draw a colorful pixel
            }
        }
    }


    function MandelbrotSetVerification(x, y) {
        var real = x;
        var img = y;

        for (var i = 0; i < maxIter; i++) {
            var tempReal = real * real - img * img + x;
            var tempImg = 2 * real * img + y;

            real = tempReal;
            img = tempImg;
            if (real * img > 5) {
                return (i / maxIter * 100);
            }
        }
        return 0;
    }
}