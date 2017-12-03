//when we receive a character update
const update = (data) => {
  //if we do not have that character (based on their id)
  //then add them
  console.dir(data.name);
  if(!users[data.name]) {
    users[data.name] = data;
    return;
  }

  //if the update is for our own character (we dont need it)
  //Although, it could be used for player validation
  if(data.name === name){
    return;
  }
  
  //if we received an old message, just drop it
  if(users[data.name].lastUpdate >= data.lastUpdate) {
    return;
  }
  
  const user = users[data.name];
  user.scorebar = data.scorebar;
  
  //console.dir(data.speedX)
};


//function to remove a character from our character list
const removeUser = (data) => {
  //if we have that character, remove them
  if(users[data.name]) {
    delete users[data.name];
  }
};

const setUser = (data) => {
  name = data.name; //set this user's hash to the unique one they received
  users[name] = data; //set the character by their name

};

//update this user's positions based on keyboard input
const updatePosition = () => {
  const user = users[hash];


  //reset this character's alpha so they are always smoothly animating
  square.alpha = 0.05;

  //send the updated movement request to the server to validate the movement.
  socket.emit('movementUpdate', square);
};

const updateScore = (data) => {
    scoreBar = data;
};

const setupGame = () => {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    requestAnimationFrame(draw); //start animating
    //Socket Connect Part
    gameState = 0;
    scoreBar = 500;
    document.body.addEventListener('keyup', keyUpHandler);
    //setInterval(draw, 10);
}

const ready = () => {
    let loadingPart = document.querySelector('#loadingPart');
    name = document.querySelector("#username").value;
    loginPart.innerHTML = "Waiting for the second user...";
        
    if(!name) {
        user = 'unknown';
    } 
        
    socket.emit('join', {name: name});
    socket.on('startRoom', (data) => {
        loadingPart.style.display = 'none';
        //    socket.on('setUser', setUser);User(data);
        let appPart = document.querySelector('#appPart');
        appPart.style.display = 'block';
        setupGame();
    });
    
};