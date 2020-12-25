var c = document.getElementById("myCanvas");
var context = c.getContext("2d");

// Create gradient
var grd = context.createRadialGradient(0,0,c.width/2,c.width,c.height,c.width/2);
grd.addColorStop(0, 'blue');
grd.addColorStop(0.25, 'white');
grd.addColorStop(0.5, 'purple');
grd.addColorStop(0.75, 'red');
grd.addColorStop(1, 'yellow');


// Fill with gradient

// ctx.fillStyle = grd;
// ctx.rect(0, 0, 50, 256);
// ctx.arc(100, 200, 60, 1 * Math.PI, 0);
// ctx.globalAlpha = 0.1;
// ctx.beginPath();
// ctx.arc(100, 75, 60, 1 * Math.PI, 0);
// ctx.arc(120, 75, 50, 1 * Math.PI, 0);
// ctx.fill();


// draw blue rectangle
context.beginPath();
context.rect(200, 20, 100, 100);
context.fillStyle = 'blue';
context.fill();

// draw transparent red circle
context.globalAlpha = 0.1;
context.beginPath();
context.arc(320, 120, 60, 0, 2 * Math.PI, false);
context.fillStyle = 'yellow';
context.fill();