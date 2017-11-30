let canvas;
let ctx;
let gameState;
let scoreBar;


//Quang connecting room
let myRoom;



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
       scoreBar = 500;
    }
    else if(keyPressed == 37){
        if(gameState == 2){
          gameState = 1;
          scoreBar -= 2;
        }
    }
    else if(keyPressed == 39){
        if(gameState == 1){
          gameState = 2;
          scoreBar -= 2;
        }
    }
}
const setupSocket = () => {
     //Socket Connect Part
    socket = io.connect();
    socket.on('connect', ready);
};

const setupGame = () => {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    
    //Socket Connect Part
    gameState = 0;
    scoreBar = 500;
    document.body.addEventListener('keyup', keyUpHandler);
    requestAnimationFrame(draw);
    //setInterval(draw, 10);
}
        

const init = () => {
  
  //setup the socket
  const connect = document.querySelector('#connect');
  connect.addEventListener('click', setupSocket);
  
};

window.onload = init;
