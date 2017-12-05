let canvas;
let ctx;
let gameState;
let currentGame;
let pumpSpot;
let pumping;
let scoreBar;

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
                        else if(gameState == 3){
                            currentGame = 1;
                            gameState = 0;
                            scoreBar = 0;
                            users[name].scorebar = 0;
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
                        else if(gameState == 3){
                            currentGame = 2;
                            gameState = 0;
                            scoreBar = 450;
                            users[name].scorebar = 450;
                        }
                        break;
                    case 38:
                        if(gameState == 1){
                            pumping = false;
                        }
                        gameState = 1;
                        break;
                }
            case 2: 
                switch(keyPressed){
                    case 32:
                        if(gameState == 0){
                            gameState = 1;
                        }
                        else if(gameState == 5){
                            currentGame = 0;
                            gameState = 0;
                            scoreBar = 450; 
                            users[name].scorebar = 450;
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
};

        
const init = () => {
  //setup the socket
  const connect = document.querySelector('#connect');
  connect.addEventListener('click', setupSocket);
};

window.onload = init;
