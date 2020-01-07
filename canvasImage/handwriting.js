var canvasWidth = Math.min(600, $(window).width() - 10);
var canvasHeight = canvasWidth;

var strokeColor = 'black';
var isMouseDown = false;
var lastLoc = {x: 0, y: 0};
var lastTime = 0;
var lastLineWidth = -1;

var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$("#controller").css('width', canvasWidth + 'px');

drawGrid();
$('#clear_btn').click(function(e){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGrid();
})
$('.color_btn').click(function(e){
    $('.color_btn').removeClass('color_btn_selected')
    $(this).addClass('color_btn_selected')
    strokeColor = $(this).css('background-color')
})

function beginStroke(point){
    isMouseDown = true;
    lastLoc = windowToCanvas(point.x, point.y);
    lastTime = new Date().getTime();
}

function endStroke(){
    isMouseDown = false;
}

function moveStroke(point){
    var curLoc = windowToCanvas(point.x, point.y);
    var curTime = new Date().getTime();
    var s = calcDistance(curLoc, lastLoc)
    var t = curTime - lastTime;

    var lineWidth = calcLineWidth(t, s);

    ctx.beginPath();
    ctx.moveTo(lastLoc.x, lastLoc.y);
    ctx.lineTo(curLoc.x, curLoc.y);

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastLoc = curLoc;
    lastTime = curTime;
    lastLineWidth = lineWidth;
}

canvas.onmousedown = function(e) {
    e.preventDefault();
    beginStroke({x: e.clientX, y: e.clientY})
}

canvas.onmouseup = function(e) {
    e.preventDefault();
    endStroke();
}

canvas.onmousemove = function(e){
    e.preventDefault();
    if(isMouseDown){
        moveStroke({x:e.clientX, y:e.clientY})
    }
}

canvas.onmouseout = function(e){
    e.preventDefault();
    endStroke();
}

canvas.addEventListener('touchstart',function(e){
    e.preventDefault();
    var touch = e.touches[0];
    beginStroke({x: touch.pageX, y: touch.pageY})

})
canvas.addEventListener("touchmove",function(e){
    e.preventDefault();
    if(isMouseDown){
        var touch = e.touches[0];
        moveStroke({x:touch.pageX, y:touch.pageY})
    }
})
canvas.addEventListener('touchend',function(e){
    e.preventDefault();
    endStroke();
})

function calcLineWidth(t, s){
    var v = s / t;
    var resLineWidth;
    if(v < minStrokeV){
        resLineWidth = maxLineWidth;
    }else if(v >= maxStrokeV){
        resLineWidth = minLineWidth;
    }else{
        resLineWidth = maxLineWidth - (v - minStrokeV) / (maxStrokeV - minStrokeV) * (maxLineWidth - minStrokeV)
    }
    if(lastLineWidth == -1){
        return resLineWidth;
    }
    return lastLineWidth * 2 / 3 + resLineWidth * 1 / 3;
}

function calcDistance(loc1, loc2){
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
}

function windowToCanvas(x, y){
    var bbox = canvas.getBoundingClientRect();
    return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)};
}

function drawGrid() {

    ctx.save();

    ctx.strokeStyle = 'rgb(230, 11, 9)'

    ctx.beginPath();
    ctx.moveTo(3, 3);
    ctx.lineTo(canvasWidth - 3, 3);
    ctx.lineTo(canvasWidth - 3, canvasHeight - 3);
    ctx.lineTo(3, canvasHeight - 3);
    ctx.closePath();

    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasWidth, canvasHeight);

    ctx.moveTo(canvasWidth, 0);
    ctx.lineTo(0, canvasHeight);

    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);

    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);

    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

}
