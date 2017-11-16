"use strict";

var socket = void 0;
var canvas = void 0;
var ctx = void 0;
var gameState = void 0;
var scoreBar = void 0;

var square = {
    updateTime: new Date().getTime(),
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    color: '#000000'
};

var draw = function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';
    ctx.fillRect(0, scoreBar, 500, 500);
    if (scoreBar <= 0) {
        scoreBar = 0;
        ctx.fillStyle = 'white';
        ctx.font = "20px Arial";
        ctx.fillText("Congratulations!", 180, 200);
        ctx.fillText("Press Space to Restart", 150, 250);
    }
    switch (gameState) {
        case 0:
            break;
        case 1:
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'red';
            ctx.fillRect(200, 450, 50, 50);
            break;
        case 2:
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = 'blue';
            ctx.fillRect(250, 450, 50, 50);
            break;
    }
};

var setupSocket = function setupSocket() {
    //Socket Connect Part
    socket = io.connect();

    socket.on('connect', function () {
        console.log('connecting');

        socket.emit('join', {});
    });
};

var updateDrawstack = function updateDrawstack(data) {
    draw();
};

var init = function init() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");

    //Socket Connect Part
    gameState = 0;
    scoreBar = 500;
    window.addEventListener("keyup", function (evt) {
        if (evt.keyCode == 32) {
            gameState = 1;
            scoreBar = 500;
        } else if (evt.keyCode == 37) {
            if (gameState == 2) {
                gameState = 1;
                scoreBar -= 2;
            }
        } else if (evt.keyCode == 39) {
            if (gameState == 1) {
                gameState = 2;
                scoreBar -= 2;
            }
        }
    });
};

window.onload = init;
setInterval(draw, 10);
