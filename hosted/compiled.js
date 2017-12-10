'use strict';

var draw = function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var keys = Object.keys(users);
    for (var i = keys.length - 1; i >= 0; i--) {
        var user = users[keys[i]];
        ctx.fillStyle = user.color;
        var a = '#';
        a += user.color;
        tiles[i] = document.querySelector(a);
    }

    switch (currentGame) {
        case 0:
            //Testing
            yellow = document.createElement("span");
            yellow.textContent = users[name].color.toUpperCase() + ' ';
            yellow.style.color = users[name].color;

            instruction = document.getElementById("instruction");
            //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";

            instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the ";
            instruction.appendChild(yellow);
            instruction.innerHTML += 'platform.';
            break;

        case 1:
            console.dir("haha");
            //Testing
            yellow = document.createElement("span");
            yellow.textContent = users[name].color.toUpperCase() + ' ';
            yellow.style.color = users[name].color;

            instruction = document.getElementById("instruction");
            //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";

            instruction.innerHTML = "Use Up and Down Arrow Keys to Inflat the ";
            instruction.appendChild(yellow);
            instruction.innerHTML += 'circle.';
            break;

        case 2:
            //Testing
            yellow = document.createElement("span");
            yellow.textContent = users[name].color.toUpperCase() + ' ';
            yellow.style.color = users[name].color;

            instruction = document.getElementById("instruction");
            //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";

            instruction.innerHTML = "Use Arrow Keys to Raise the ";
            instruction.appendChild(yellow);
            instruction.innerHTML += 'flags.';
            break;
    }

    switch (currentGame) {
        case 0:
            //for each user
            for (var _i = 0; _i < keys.length; _i++) {
                var _user = users[keys[_i]];
                //ctx.fillStyle = user.color;
                //ctx.strokeStyle = user.color;
                ctx.drawImage(tiles[_i], _user.spaceX, _user.scorebar);
                //ctx.fillRect(user.spaceX, user.scorebar, user.widthX, 500);
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
                case 5:
                    drawWin();
                    break;
            }

            break;
        case 1:
            //for each user
            for (var _i2 = keys.length - 1; _i2 >= 0; _i2--) {
                var _user2 = users[keys[_i2]];
                ctx.fillStyle = _user2.color;
                ctx.strokeStyle = _user2.color;
                ctx.beginPath();
                ctx.arc(250, 500 - _user2.scorebar, _user2.scorebar, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
            switch (gameState) {
                case 0:
                    break;
                case 1:
                    if (pumping == true) {
                        pumpSpot += 1;
                        if (pumpSpot >= 15) {
                            pumpSpot = 15;
                        }
                    }
                    ctx.fillStyle = 'red';
                    ctx.strokeStyle = 'red';
                    ctx.fillRect(200, 490 - pumpSpot, 100, 10);
                    break;
                case 2:
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                    ctx.fillRect(200, 490, 100, 10);
                    break;
                case 5:
                    drawWin();
                    break;
            }
            break;
        case 2:
            var polePos = 0;
            for (var _i3 = keys.length - 1; _i3 >= 0; _i3--) {
                var _user3 = users[keys[_i3]];
                ctx.fillStyle = 'grey';
                ctx.fillRect(_user3.spaceX + 125, 50, 10, 500);
                ctx.fillStyle = _user3.color;
                ctx.strokeStyle = _user3.color;
                ctx.beginPath();
                ctx.moveTo(_user3.spaceX + 130, _user3.scorebar);
                ctx.lineTo(_user3.spaceX + 130, _user3.scorebar - 50);
                ctx.lineTo(_user3.spaceX + 200, _user3.scorebar - 25);
                ctx.fill();
                ctx.stroke();
                polePos = _user3.spaceX;
            }
            switch (gameState) {
                case 0:
                    break;
                case 1:
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(polePos + 125, 450, 5, 50);
                    break;
                case 2:
                    ctx.fillStyle = 'red';
                    ctx.fillRect(polePos + 75, 450, 50, 5);
                    break;
                case 3:
                    ctx.fillStyle = 'black';
                    ctx.fillRect(polePos + 125, 400, 5, 50);
                    break;
                case 4:
                    ctx.fillStyle = 'white';
                    ctx.fillRect(polePos + 125, 450, 50, 5);
                    break;
                case 5:
                    drawWin();
                    break;
            }
            break;
        case 3:
            ctx.textAlign = "center";
            ctx.fillText(overallWinner + " Wins!", 250, 200);
            ctx.fillText("To Play Again, Press Space to Ready.", 250, 220);
    }
    socket.emit('movementUpdate', users[name]);
    requestAnimationFrame(draw);
};

var drawWin = function drawWin() {
    ctx.textAlign = "center";
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    ctx.fillText(currentWinner + " Wins!", 250, 200);
    ctx.fillText("Press Space to Move On!", 250, 220);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var gameState = void 0;
var currentGame = void 0;
var pumpSpot = void 0;
var pumping = void 0;
var scoreBar = void 0;
var gameWins = void 0;
var currentWinner = void 0;
var overallWinner = void 0;
var gameReady = void 0;
var playerReady = void 0;

//our websocket connection
var socket = void 0;
var changedName = void 0;
var name = void 0;
var animationFrame = void 0;
var instruction = void 0;
var yellow = void 0;

//Quang connecting room
var users = [];
var tiles = [];
var user = void 0;

//Image assets
var greyTile = void 0;
var brownTile = void 0;

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
    switch (currentGame) {
        case 0:
            switch (keyPressed) {
                case 32:
                    if (gameState == 0) {
                        gameState = 1;
                    } else if (gameState == 5) {
                        if (playerReady) {
                            socket.emit('resetScores');
                        } else {
                            users[name].scorebar = 0;
                            socket.emit('ready');
                        }
                    }
                    break;
                case 37:
                    if (gameState == 1) {
                        gameState = 2;
                        users[name].scorebar -= 40;
                        if (users[name].scorebar < 0) {
                            users[name].scorebar = 0;
                        }
                    }
                    break;
                case 39:
                    if (gameState == 2) {
                        gameState = 1;
                        users[name].scorebar -= 40;
                        if (users[name].scorebar < 0) {
                            users[name].scorebar = 0;
                        }
                    }
                    break;
            }
            break;
        case 1:
            switch (keyPressed) {
                case 32:
                    if (gameState == 0) {
                        gameState = 2;
                    } else if (gameState == 5) {
                        if (playerReady) {
                            socket.emit('resetScores');
                        } else {
                            users[name].scorebar = 450;
                            socket.emit('ready');
                        }
                    }
                    break;
                case 38:
                    if (gameState != 5) {
                        if (gameState == 1) {
                            pumping = false;
                        }
                        gameState = 1;
                    }
                    break;
            }
            break;
        case 2:
            switch (keyPressed) {
                case 32:
                    if (gameState == 0) {
                        gameState = 1;
                    } else if (gameState == 5) {
                        if (playerReady) {
                            socket.emit('resetScores');
                        } else {
                            users[name].scorebar = 450;
                            socket.emit('gameEnd', gameWins);
                            socket.emit('ready');
                        }
                    }
                    break;
                case 37:
                    if (gameState == 1) {
                        gameState = 2;
                        users[name].scorebar -= 5;
                        if (users[name].scorebar < 0) {
                            users[name].scorebar = 0;
                        }
                    }
                    break;
                case 38:
                    if (gameState == 2) {
                        gameState = 3;
                        users[name].scorebar -= 5;
                        if (users[name].scorebar < 0) {
                            users[name].scorebar = 0;
                        }
                    }
                    break;
                case 39:
                    if (gameState == 3) {
                        gameState = 4;
                        users[name].scorebar -= 5;
                        if (users[name].scorebar < 0) {
                            users[name].scorebar = 0;
                        }
                    }
                    break;
                case 40:
                    if (gameState == 4) {
                        gameState = 1;
                        users[name].scorebar -= 5;
                        if (users[name].scorebar < 0) {
                            users[name].scorebar = 0;
                        }
                    }
                    break;
            }
    }
};
var keyDownHandler = function keyDownHandler(e) {
    var keyPressed = e.which;
    switch (currentGame) {
        case 0:
            break;
        case 1:
            switch (keyPressed) {
                case 38:
                    if (gameState != 3 && gameState != 5) {
                        pumping = true;
                        gameState = 1;
                    }
                    break;
                case 40:
                    if (gameState == 1) {
                        users[name].scorebar += pumpSpot;
                        pumpSpot = 0;
                        gameState = 2;
                        pumping = false;
                    }
                    break;
            }
    }
};

var setupSocket = function setupSocket() {
    //Socket Connect Part
    socket = io.connect();
    socket.on('connect', launchGame);
    socket.on('nameChange', changeName);
    socket.on('setUser', setUser);
    socket.on('updatedMovement', update);
    socket.on('playerReady', readyUp);
    socket.on('getScore', compareScore);
    socket.on('sendWinner', setWinner);
    socket.on('nextGame', readyNextGame);
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
    //console.dir(data.name);
    if (!users[data.name]) {
        users[data.name] = data;
        return;
    }

    //if we received an old message, just drop it
    if (users[data.name].lastUpdate >= data.lastUpdate) {
        return;
    }

    var user = users[data.name];
    user.scorebar = data.scorebar;

    if (gameState != 5) {
        switch (currentGame) {
            case 0:
                if (user.scorebar <= 0) {
                    gameWin(user);
                    scoreBar = 0;
                }
                break;
            case 1:
                if (user.scorebar >= 250) {
                    gameWin(user);
                    scoreBar = 250;
                }
                break;
            case 2:
                if (user.scorebar <= 100) {
                    gameWin(user);
                    scoreBar = 100;
                }
                break;
        }
    }

    //if the update is for our own character (we dont need it)
    //Although, it could be used for player validation
    if (user.name === name) {

        return;
    }

    //console.dir(data.speedX)
};

var gameWin = function gameWin(player) {
    currentWinner = player.name;
    if (player.name == name) {
        gameWins++;
    }
    gameState = 5;
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
    console.log(name);
    users[name] = data; //set the character by their name

    //Testing
    var yellow = document.createElement("span");
    yellow.textContent = users[name].color.toUpperCase() + ' ';
    yellow.style.color = users[name].color;

    instruction = document.getElementById("instruction");
    //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";

    instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the ";
    instruction.appendChild(yellow);
    instruction.innerHTML += 'platform.';
    if (changedName == true) {
        instruction.innerHTML += " The username you chose was taken. Your name has been changed to ";
        instruction.innerHTML += name;
    }
};

var changeName = function changeName() {
    changedName = true;
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
    currentGame = 0;
    scoreBar = 450;
    gameWins = 0;
    pumpSpot = 0;
    pumping = false;
    currentWinner = "";
    overallWinner = "";
    playerReady = false;
    document.body.addEventListener('keyup', keyUpHandler);
    document.body.addEventListener('keydown', keyDownHandler);
    //setInterval(draw, 10);
};

var launchGame = function launchGame() {
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

var readyUp = function readyUp() {
    if (!playerReady) {
        switch (currentGame) {
            case 0:
                users[name].scorebar = 0;
                break;
            case 1:
                users[name].scorebar = 450;
                break;
            case 2:
                users[name].scorebar = 450;
                break;
        }
        console.log("Partner is Ready. Press Space to begin.");
        playerReady = true;
    }
};

var readyNextGame = function readyNextGame() {
    gameState = 0;
    playerReady = false;
    switch (currentGame) {
        case 0:
            currentGame = 1;
            break;
        case 1:
            currentGame = 2;
            break;
        case 2:
            currentGame = 3;
            break;
    }
};

var compareScore = function compareScore(score) {
    if (gameWins > score) {
        overallWinner = name;
        socket.emit('winner', name);
    } else {
        socket.emit('gameEnd', gameWins);
    }
};

var setWinner = function setWinner(winnerName) {
    overallWinner = winnerName;
};
