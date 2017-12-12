let canvas;
let ctx;
let gameState;
let currentGame;
let pumpSpot;
let pumping;
let scoreBar;
let gameWins;
let currentWinner;
let overallWinner;
let gameReady;
let playerReady;

//our websocket connection
let socket;
let changedName;
let name;
let animationFrame;
let instruction;
let yellow;

//Quang connecting room
let users = [];

let user;

//Image assets
let controller1;
let controller2;
let tiles = [];


let square = {
    updateTime: new Date().getTime(),
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    color: '#000000'
};

const keyUpHandler = (e) => {
    var keyPressed = e.which;
        switch(currentGame){
            case 0:
                switch(keyPressed){
                    case 32:
                        if(gameState == 0){
                            gameState = 1;
                        }
                        else if(gameState == 5){
                            if(playerReady){
                                socket.emit('resetScores');
                            }
                            else{
                                users[name].scorebar = 0;
                                socket.emit('ready');
                                document.getElementById("start").innerHTML = "Waiting for Partner...";
                                document.getElementById("instruction").innerHTML = "";
                            }
                        }
                        break;
                    case 37:
                        if(gameState == 1){
                            gameState = 2;
                            users[name].scorebar -= 4;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                    case 39:
                        if(gameState == 2){
                            gameState = 1;
                            users[name].scorebar -= 4;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                }
                break;
            case 1:
                switch(keyPressed){
                    case 32:
                        if(gameState == 0){
                            gameState = 2;
                        }
                        else if(gameState == 5){
                            if(playerReady){
                                socket.emit('resetScores');
                            }
                            else{
                                users[name].scorebar = 450;
                                socket.emit('ready');
                                document.getElementById("start").innerHTML = "Waiting for Partner...";
                                document.getElementById("instruction").innerHTML = "";
                            }
                        }
                        break;
                    case 38:
                        if(gameState != 5){
                            if(gameState == 1){
                                pumping = false;
                            }
                            gameState = 1;
                        }
                        break;
                }
                break;
            case 2: 
                switch(keyPressed){
                    case 32:
                        if(gameState == 0){
                            gameState = 1;
                        }
                        else if(gameState == 5){
                            if(playerReady){
                                socket.emit('resetScores');
                            }
                            else{
                                users[name].scorebar = 450;
                                socket.emit('gameEnd', gameWins);
                                socket.emit('ready');
                                document.getElementById("start").innerHTML = "Waiting for Partner...";
                                document.getElementById("instruction").innerHTML = "";
                            }
                        }
                        break;
                    case 37:
                        if(gameState == 1){
                            gameState = 2;
                            users[name].scorebar -= 5;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                    case 38:
                        if(gameState == 2){
                            gameState = 3;
                            users[name].scorebar -= 5;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                    case 39:
                        if(gameState == 3){
                            gameState = 4;
                            users[name].scorebar -= 5;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                    case 40:
                        if(gameState == 4){
                            gameState = 1;
                            users[name].scorebar -= 5;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                }
    }

}
const keyDownHandler = (e) => {
    var keyPressed = e.which;
    switch(currentGame){
        case 0:
            break;
        case 1:
            switch(keyPressed){
                case 38:
                    if(gameState != 3 && gameState != 5){
                        pumping = true;
                        gameState = 1;
                    }
                    break;
                case 40:
                    if(gameState == 1){
                        users[name].scorebar += pumpSpot;
                        pumpSpot = 0;
                        gameState = 2;
                        pumping = false;
                    }
                    break;
            }
    }
};

const setupSocket = () => {
     //Socket Connect Part
    socket = io.connect();
    socket.on('connect', launchGame);
    socket.on('nameChange', changeName);
    socket.on('setUser', setUser);
    socket.on('updatedMovement', update);
    socket.on('playerReady', readyUp);
    socket.on('getScore', compareScore);
    socket.on('victory', victory);
    socket.on('sendWinner', setWinner);
    socket.on('nextGame', readyNextGame);
};

        
const init = () => {
  controller1 = document.querySelector('#controller1');
  controller2 = document.querySelector('#controller2  ');
  //setup the socket
  const connect = document.querySelector('#connect');
  connect.addEventListener('click', setupSocket);
};

window.onload = init;
