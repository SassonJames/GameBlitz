let canvas;
let ctx;
let gameState;
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
    if (keyPressed == 32) {
       gameState = 1;
    }
    else if(keyPressed == 37){
        if(gameState == 2){
          gameState = 1;
          users[name].scorebar -= 2;
        }
    }
    else if(keyPressed == 39){
        if(gameState == 1){
          gameState = 2;
          users[name].scorebar -= 2;
        }
    }
}
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
