//when we receive a character update
const update = (data) => {
    
  //if we do not have that character (based on their id)
  //then add them
  if(!users[data.name]) {
    users[data.name] = data;
    return;
  }

  //if we received an old message, just drop it
  if(users[data.name].lastUpdate >= data.lastUpdate) {
    return;
  }
    
  //if the update is for our own character (we dont need it)
  //Although, it could be used for player validation
  if(data.name === name){
    return;
  }
  
  // Set the user, then update their scorebar
  const user = users[data.name];
  user.scorebar = data.scorebar;

  // If we are in gamestate 5, aka the current game is over
  if(gameState != 5){
      
      // Based on the game, check if that user just won
      // If they did, call the gameWin function
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
};

// When a player wins, set the currentWinner's name
// If that is this player, increase their score
// Then let the other player know and set the gameState to 5
const gameWin = (player) => {
    currentWinner = player.name;
    if(player.name == name){
        gameWins++;
    }
    socket.emit("victory", currentWinner);
    gameState = 5;
};

// This is called if another player knows someone just won
// Set the currentWinner to the victor variable
// If that winner was me, increase my gameWins
// Then set the gameState to 5
const victory = (victor) => {
    currentWinner = victor;
    if(victor == name){
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

// Set this client's user
const setUser = (data) => {
  name = data.name; //set this user's hash to the unique one they received
  users[name] = data; //set the character by their name
  
  //Testing
  var yellow = document.createElement("span");
  yellow.textContent = users[name].color.toUpperCase()+ ' ';
  yellow.style.color = users[name].color;
};

// If the player's name was changed, let this client know
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

// Update the player's local scorebar
const updateScore = (data) => {
    scoreBar = data;
};

// Setup the initial game, called after both players connect
const setupGame = () => {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    requestAnimationFrame(draw); //start animating
    
    // Initialize all our variables to the starting values
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
}

// Launches the game onto the server
const launchGame = () => {
    
    // Remove the DLC from the screen
    document.querySelector('#dlc').style.display = 'none';
    
    // Let the user know they are waiting for another player
    let loadingPart = document.querySelector('#loadingPart');
    name = document.querySelector("#username").value;
    loginPart.innerHTML = "Waiting for the second user...";
    
    // If the user has no name, set it to unknown
    if(!name) {
        name = 'unknown';
    } 
      
    // Let the server know that this client has joined
    socket.emit('join', {name: name});
    
    // Start the room if there isn't any
    socket.on('startRoom', (data) => {
        loadingPart.style.display = 'none';
        
        // Start showing the app's screen, also shows ads
        let appPart = document.querySelector('#appPart');
        appPart.style.display = 'block';
        
        // Setup the game
        setupGame();
    });
    
};

// Called when the other player has told the server they are ready
const readyUp = () => {
    
    // If this player is not ready
    // Make sure their score is reset for the next game
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
            case 3:
                gameWins = 0;
                break;
        }
        
        // Change the text for clarity, let them know the partner is waiting
        document.getElementById("start").innerHTML = "Partner is Ready! Press Space to Continue!";
        document.getElementById("instruction").innerHTML = "";
        
        // Set this player's status to ready
        playerReady = true;
    }
};

// Switch the game to the next one
const readyNextGame = () => {
    
    // gameState is back to 0
    gameState = 0;
    
    // reset playerReady variable
    playerReady = false;
    
    // Depending on the game, start the next game or go to the end screen
    switch(currentGame){
        case 0:
            currentGame = 1;
            break;
        case 1:
            currentGame = 2;
            break;
        case 2:
            currentGame = 3;
            document.getElementById("start").innerHTML = "Play Again?";
            gameState = 5;
            break;
        case 3:
            currentGame = 0; // Go back to the first game
            break;
    }
};

// Compare my score to the other user's score
// Called at the end of the contest
const compareScore = (score) => {
    
    // If I have more wins, the overall winner is me
    // Set my name and let the other player know I won
    if(gameWins > score){
        overallWinner = name;
        socket.emit('winner', name);
    }
    
    // If I didn't win, have the other player check to see if they won
    else{
        socket.emit('gameEnd', gameWins);
    }
};

// Revieved when the overall winner is determined
// Set the overall winner to the winnerName
const setWinner = (winnerName) => {
    overallWinner = winnerName;
};