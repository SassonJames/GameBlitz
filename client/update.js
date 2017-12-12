//when we receive a character update
const update = (data) => {
  //if we do not have that character (based on their id)
  //then add them
  //console.dir(data.name);
  if(!users[data.name]) {
    users[data.name] = data;
    return;
  }

  //if we received an old message, just drop it
  if(users[data.name].lastUpdate >= data.lastUpdate) {
    return;
  }
  
  const user = users[data.name];
  user.scorebar = data.scorebar;

  if(gameState != 5){
      switch(currentGame){
          case 0:
              if(user.scorebar <= 0){
                  gameWin(user);
                  scoreBar = 0;
              }
              break;
          case 1:
              if(user.scorebar >= 250){
                  gameWin(user);
                  scoreBar = 250;
              }
              break;
          case 2:
              if(user.scorebar <= 100){
                  gameWin(user);
                  scoreBar = 100;
              }
              break;
      }
  }
  

    
  //if the update is for our own character (we dont need it)
  //Although, it could be used for player validation
  if(user.name === name){
    
    return;
  }
  
  //console.dir(data.speedX)
};

const gameWin = (player) => {
    currentWinner = player.name;
    if(player.name == name){
        gameWins++;
    }
    gameState = 5;
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
  console.log(name);
  users[name] = data; //set the character by their name
  
  //Testing
  var yellow = document.createElement("span");
  yellow.textContent = users[name].color.toUpperCase()+ ' ';
  yellow.style.color = users[name].color;
  
  instruction = document.getElementById("instruction");
  //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";
  
  instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the ";
  instruction.appendChild(yellow);
  instruction.innerHTML += 'platform.';
  if(changedName == true){
      instruction.innerHTML += " The username you chose was taken. Your name has been changed to ";
      instruction.innerHTML += name;
  }
};

const changeName = () => {
    changedName = true;
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
}

const launchGame = () => {
    
    document.querySelector('#dlc').style.display = 'none';
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

const readyUp = () => {
    if(!playerReady){
        switch(currentGame){
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
        document.getElementById("start").innerHTML = "Partner is Ready! Press Space to Continue!";
        document.getElementById("instruction").innerHTML = "";
        playerReady = true;
    }
};

const readyNextGame = () => {
    gameState = 0;
    playerReady = false;
    switch(currentGame){
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

const compareScore = (score) => {
    if(gameWins > score){
        overallWinner = name;
        socket.emit('winner', name);
    }
    else{
        socket.emit('gameEnd', gameWins);
    }
};

const setWinner = (winnerName) => {
    overallWinner = winnerName;
};