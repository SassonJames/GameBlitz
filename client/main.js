// General Variables
let canvas;             // Canvas Variable, where the game takes place
let ctx;                // Context Variable, our current Context
let gameState;          // The current gamestate, tracks what keys are allowed to be pressed and what to draw
let currentGame;        // Current game is the current game being played, Updates Assets in draw
let pumpSpot;           // Keeps track of the number for the pump in Game 2, used to increase score in Game 2
let pumping;            // Boolean to ask if the user is pumping still, if they are it increases the score to a cap
let scoreBar;           // The user's current score, tracked and updated through the key presses
let gameWins;           // How many win this player currently has, updated when a player wins
let currentWinner;      // The winner of the current game, determined at the end of each game
let overallWinner;      // Winner of the entire contest, determined based on gameWins variable, calculated at end Game 3
let gameReady;          // Let's the player know that the game is currently ready to be played
let playerReady;        // If the player is ready, alter what the spacebar allows for.

//our websocket connection
let socket;             // Our Socket, connects to the server
let changedName;        // If our name was changed, keep track of it
let name;               // Our username that the client put in during login
let animationFrame;     // Animation Frame to update draws
let instruction;        // instruction box, keeps track of the current instructions per game
let yellow;             // Player's default color

//Quang connecting room
let users = [];

// The Current user, this client
let user;

//Image assets
let controller1;  // Off Switch
let controller2;  // On Switch
let tiles = [];   // Tile Array to update image assets

// Updates our Date/Time of updates
let square = {
    updateTime: new Date().getTime(),
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    color: '#000000'
};

/*
*
* The meat of main is the inputs. These handlers update the points.
* They switch of the currentgame and then the gamestate.
* The KeyUp tracks when a key is released, based on that it increases points or ends the game
* The KeyDown handler is specific to Game2 as it allows for players to hold a key. (Also allows Players to Replay Game on the End Screen)
* The breakdown of each event and the game is in these handlers
*
*/
const keyUpHandler = (e) => {
    
    // Which Key was pressed?
    var keyPressed = e.which;
    
        // Depending on the Game, determine what to check for
        switch(currentGame){
            
            /*
            * In Game 1, Players flip a switch back and forth to raise their platform to the top
            * Plays like a lifting a large amount of weight, hence the rock assets
            * Depending on the gameState, the switch is on or off, moving back and forth lifts the platform
            *
            */
            case 0:
                switch(keyPressed){
                    
                    // Spacebar
                    case 32:
                        
                        // If the game just started, give player control by hitting spacebar
                        if(gameState == 0){
                            gameState = 1;
                        }
                        
                        // If it's gamestate 5, the game is over. This will ready up or start the next game
                        else if(gameState == 5){
                            if(playerReady){
                                socket.emit('resetScores');  // Starts the next game if the player is ready
                            }
                            else{
                                // Set the scorebar to the starting scorebar of the next game
                                users[name].scorebar = 0;
                                
                                // Let the other player know that this user is ready by emitting 'ready'
                                socket.emit('ready');
                                
                                // Switch text for clarity
                                document.getElementById("start").innerHTML = "Waiting for Partner...";
                                document.getElementById("instruction").innerHTML = "";
                            }
                        }
                        break;
                    
                    // Left Arrow Key
                    case 37:
                        // Only if the switch is off (game state 1)
                        if(gameState == 1){
                            
                            // Set the switch to on (game state 2)
                            gameState = 2;
                            
                            // Increase player score
                            users[name].scorebar -= 4;
                            
                            // If the player has reached the top of the screen
                            // Don't let the scorebar go past it
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                    
                    // Right Arrow Key
                    case 39:
                        // Only if the switch is on (game state 2)
                        if(gameState == 2){
                            
                            // Set the switch to off (game state 1)
                            gameState = 1;
                            
                            // Increase player score
                            users[name].scorebar -= 4;
                            
                            // If the player has reached the top of the screen
                            // Don't let the scorebar go past it
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                }
                break;
            
            /*
            * In Game 2 Players have to pump a bubble so it fills up the screen
            * There are two strategies, quickly pump up and down or hold up and pump a larger amount
            * This is split up a little into the KeyDown handler
            * The victor is determined when the bubble is as big as the canvas
            *
            */
            case 1:
                switch(keyPressed){
                        
                    // Spacebar
                    case 32:
                        
                        // If the game just started, give player control by hitting spacebar
                        if(gameState == 0){
                            gameState = 2;
                        }
                        
                        // If it's gamestate 5, the game is over. This will ready up or start the next game
                        else if(gameState == 5){
                            if(playerReady){
                                socket.emit('resetScores');  // Starts the next game if the player is ready
                            }
                            else{
                                // Set the scorebar to the starting scorebar of the next game
                                users[name].scorebar = 450;
                                
                                // Let the other player know that this user is ready by emitting 'ready'
                                socket.emit('ready');
                                
                                 // Switch text for clarity
                                document.getElementById("start").innerHTML = "Waiting for Partner...";
                                document.getElementById("instruction").innerHTML = "";
                            }
                        }
                        break;
                    
                    // Up Arrow Key
                    case 38:
                        // As long as the gamestate isn't 5 or 0
                        if(gameState != 5 && gameState != 0){
                            
                            // If we are currently pumping in gameState 1, stop
                            if(gameState == 1){
                                pumping = false;
                            }
                            
                            // Ensure the gameState is at 1
                            gameState = 1;
                        }
                        break;
                }
                break;
            
            /*
            *
            * In Game 3, players will crank a flag all the way up to the top of a pole
            * The first player to reach the top wins!
            * Each of these if statements does the same thing, just based on the gamestate
            * To Consolidate, the whole explanation is in the Left Arrow case.
            *
            */
            case 2: 
                switch(keyPressed){
                    
                    // Spacebar
                    case 32:
                        
                        // If the game hasn't started, give control to the player
                        if(gameState == 0){
                            gameState = 1;
                        }
                        
                        // If the game has ended either ready up or go to the end screen
                        else if(gameState == 5){
                            if(playerReady){
                                socket.emit('resetScores'); // Start reseting scores and move to the next screen
                            }
                            else{
                                // Set the game to the start for Game 1 incase of replay
                                users[name].scorebar = 450;
                                
                                // Send the amount of game wins to the other player, signifying the end of the contest
                                socket.emit('gameEnd', gameWins);
                                
                                // Let the other player know you are ready
                                socket.emit('ready');
                                
                                // Switch the text for clarity
                                document.getElementById("start").innerHTML = "Waiting for Partner...";
                                document.getElementById("instruction").innerHTML = "";
                            }
                        }
                        break;
                        
                    // Left Arrow Key
                    case 37:
                        
                        // If the Gamestate is the one prior to this one
                        // Set it equal to this one and increase the score
                        // Make sure the score doesn't go off the board
                        // If it does reset it.
                        if(gameState == 1){
                            gameState = 2;
                            users[name].scorebar -= 5;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                    
                    // Up Arrow Key
                    // See Left Arrow Key for clarification
                    case 38:
                        if(gameState == 2){
                            gameState = 3;
                            users[name].scorebar -= 5;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                        
                    // Right Arrow Key
                    // See Left Arrow Key for clarification
                    case 39:
                        if(gameState == 3){
                            gameState = 4;
                            users[name].scorebar -= 5;
                            if(users[name].scorebar < 0){
                                users[name].scorebar = 0;
                            }
                        }
                        break;
                    
                    // Down Arrow Key
                    // See Left Arrow Key for clarification
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

/*
*
* Specific to Game 2 and The End Screen
* Only Handles those specific cases
* Allows for pumping mechanic to work
*
*/
const keyDownHandler = (e) => {
    var keyPressed = e.which;
    switch(currentGame){
        case 0:
            // Do Nothing, hold case for 0
            break;
        
        // In Game 2, the keydown is more important
        case 1:
            switch(keyPressed){
                    
                // Up Arrow Key
                case 38:
                    
                    // As long as we aren't in gameState 0 or 5
                    // Begin pumping and set the gameState to 1
                    if(gameState != 0 && gameState != 5){
                        pumping = true;
                        gameState = 1;
                    }
                    break;
                    
                // Down Arrow Key
                case 40:
                    // Only if we are in gameState 1
                    if(gameState == 1){
                        users[name].scorebar += pumpSpot;   // Add the pumpSpot number to our score
                        pumpSpot = 0;                       // Set pumpSpot to 0
                        gameState = 2;                      // Set gameState to 2
                        pumping = false;                    // Set pumping to false
                    }
                    break;
            }
            break;
        case 2:
            // Do Nothing, hold case for 2
            break;
        
        // This KeyDown handles the Replay
        // Neeeds to be KeyDown due to a inconsistancy with Javascript
        case 3:
            switch(keyPressed){
                
                // Spacebar
                case 32:
                    
                    // If the player is ready
                    if(playerReady){
                        socket.emit('resetScores'); // Tell everyone to reset scores and start a new game
                        break;
                    }
                    
                    // Otherwise, reset the gameWins and tell the other player you are ready
                    else{
                        socket.emit('ready');
                        
                        // Change text for clarity
                        document.getElementById("start").innerHTML = "Waiting for Partner...";
                        document.getElementById("instruction").innerHTML = "";
                        
                        gameWins = 0;
                        break;
                    }
            }
            break;
    }
};

// Set up the socket commands
const setupSocket = () => {
     //Socket Connect Part
    socket = io.connect();
    
    socket.on('connect', launchGame);       // Once we connect, launch the game
    socket.on('nameChange', changeName);    // If we have to force a name change, call the changeName function
    socket.on('setUser', setUser);          // Setup the user when we recieve setUser
    socket.on('updatedMovement', update);   // Call the core update function when we recieve updatedMovement
    socket.on('playerReady', readyUp);      // when a player is ready, let this user know
    socket.on('getScore', compareScore);    // When recieving another player's score, compare them
    socket.on('victory', victory);          // When a player has won the current game, update my own screen to show the result
    socket.on('sendWinner', setWinner);     // Set the winner of the entire contest when sendWinner is recieved
    socket.on('nextGame', readyNextGame);   // When next game is recieved, prepare the next game
};

// Init Method
// Gets the controller assets
// Then adds an event listener to the Join button
const init = () => {
  controller1 = document.querySelector('#controller1');
  controller2 = document.querySelector('#controller2  ');
  //setup the socket
  const connect = document.querySelector('#connect');
  connect.addEventListener('click', setupSocket);
};

// When the window loads, call the init function
window.onload = init;
