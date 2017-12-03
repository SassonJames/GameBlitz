'use strict';

var draw = function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';

    var keys = Object.keys(users);

    //for each user
    for (var i = 0; i < keys.length; i++) {
        var user = users[keys[i]];
        ctx.fillRect(user.spaceX, user.scorebar, user.widthX, 500);
    }

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
    socket.emit('movementUpdate', users[name]);
    requestAnimationFrame(draw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var gameState = void 0;
var scoreBar = void 0;

//our websocket connection
var socket = void 0;
var name = void 0;
var animationFrame = void 0;

//Quang connecting room
var users = [];
var user = void 0;

var square = {
    updateTime: new Date().getTime(),
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    color: '#000000'
};

var keyUpHandler = function keyUpHandler(e) {
    var keyPressed = e.which;
    if (keyPressed == 32) {
        gameState = 1;
    } else if (keyPressed == 37) {
        if (gameState == 2) {
            gameState = 1;
            users[name].scorebar -= 2;
        }
    } else if (keyPressed == 39) {
        if (gameState == 1) {
            gameState = 2;
            users[name].scorebar -= 2;
        }
    }
};
var setupSocket = function setupSocket() {
    //Socket Connect Part
    socket = io.connect();
    socket.on('connect', ready);
    socket.on('setUser', setUser);
    socket.on('updatedMovement', update);
};

var init = function init() {
    //setup the socket
    var connect = document.querySelector('#connect');
    connect.addEventListener('click', setupSocket);
};

window.onload = init;
"use strict";

//when we receive a character update
var update = function update(data) {
  //if we do not have that character (based on their id)
  //then add them
  console.dir(data.name);
  if (!users[data.name]) {
    users[data.name] = data;
    return;
  }

  //if the update is for our own character (we dont need it)
  //Although, it could be used for player validation
  if (data.name === name) {
    return;
  }

  //if we received an old message, just drop it
  if (users[data.name].lastUpdate >= data.lastUpdate) {
    return;
  }

  var user = users[data.name];
  user.scorebar = data.scorebar;

  //console.dir(data.speedX)
};

//function to remove a character from our character list
var removeUser = function removeUser(data) {
  //if we have that character, remove them
  if (users[data.name]) {
    delete users[data.name];
  }
};

var setUser = function setUser(data) {
  name = data.name; //set this user's hash to the unique one they received
  users[name] = data; //set the character by their name
};

//update this user's positions based on keyboard input
var updatePosition = function updatePosition() {
  var user = users[hash];

  //reset this character's alpha so they are always smoothly animating
  square.alpha = 0.05;

  //send the updated movement request to the server to validate the movement.
  socket.emit('movementUpdate', square);
};

var updateScore = function updateScore(data) {
  scoreBar = data;
};

var setupGame = function setupGame() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  requestAnimationFrame(draw); //start animating
  //Socket Connect Part
  gameState = 0;
  scoreBar = 500;
  document.body.addEventListener('keyup', keyUpHandler);
  //setInterval(draw, 10);
};

var ready = function ready() {
  var loadingPart = document.querySelector('#loadingPart');
  name = document.querySelector("#username").value;
  loginPart.innerHTML = "Waiting for the second user...";

  if (!name) {
    user = 'unknown';
  }

  socket.emit('join', { name: name });
  socket.on('startRoom', function (data) {
    loadingPart.style.display = 'none';
    //    socket.on('setUser', setUser);User(data);
    var appPart = document.querySelector('#appPart');
    appPart.style.display = 'block';
    setupGame();
  });
};
