let canvas;
let ctx;
let gameState;
let currentGame;
let pumpSpot;
let pumping;
let scoreBar;
let currentWinner;
let gameReady;

//our websocket connection
let socket;
let name;
let animationFrame;

//Quang connecting room
let users = [];
let user;


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
                            socket.emit('resetScores');
                        }
                        break;
                    case 37:
                        if(gameState == 1){
                            gameState = 2;
                            users[name].scorebar -= 40;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                    case 39:
                        if(gameState == 2){
                            gameState = 1;
                            users[name].scorebar -= 40;
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
                            socket.emit('resetScores');
                        }
                        break;
                    case 38:
                        if(gameState == 1){
                            pumping = false;
                        }
                        gameState = 1;
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
                            socket.emit('resetScores');
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
                    if(gameState != 3){
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
    socket.on('connect', ready);
    socket.on('setUser', setUser);
    socket.on('updatedMovement', update);
    socket.on('nextGame', readyNextGame);
};

        
const init = () => {
  //setup the socket
  const connect = document.querySelector('#connect');
  connect.addEventListener('click', setupSocket);
};

window.onload = init;
