/*
*
* The Draw Script Controls all the drawing commands for each part of the game
* During the game, the draws will switch based on the gamestate and game being played
* This is updated on RequestAnimationFrame
*
*/
const draw = () => {
    
    // Clear out the canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // Loop through the current users
    const keys = Object.keys(users);
    for(let i = keys.length-1; i >= 0; i--){
        const user = users[keys[i]];
        tiles[i] = document.getElementById(user.color);
    }
    
    // If we aren't in the end state, display the instructions
    if(gameState != 5){
        
        // Players press space to begin the game
        document.getElementById("start").innerHTML = "Press Space to begin!"
        
        // Switching on the current game to show the proper instructions
        switch(currentGame) {
          
          // If it is currently game 1, display the instructions for game 1
          case 0:
            //Testing
            yellow = document.createElement("span");
            yellow.textContent = users[name].color.toUpperCase()+ ' ';
            yellow.style.color = users[name].color;
    
            instruction = document.getElementById("instruction");
    
            instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the ";
            instruction.appendChild(yellow);
            instruction.innerHTML += 'platform.';
            break;
          
          // If it is currently game 2, display the instructions for game 2
          case 1:
            //Testing
            yellow = document.createElement("span");
            yellow.textContent = users[name].color.toUpperCase()+ ' ';
            yellow.style.color = users[name].color;
    
            instruction = document.getElementById("instruction");
    
            instruction.innerHTML = "Use Up and Down Arrow Keys to Inflate the ";
            instruction.appendChild(yellow);
            instruction.innerHTML += 'circle.';
            break;
          
          // If it is currently game 3, display the instructions for game 3
          case 2:
            //Testing
            yellow = document.createElement("span");
            yellow.textContent = users[name].color.toUpperCase()+ ' ';
            yellow.style.color = users[name].color;
    
            instruction = document.getElementById("instruction");
            //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";
    
            instruction.innerHTML = "Use Arrow Keys to Raise the ";
            instruction.appendChild(yellow);
            instruction.innerHTML += 'flags. Crank Clockwise!';
            break;
        }
    }
  
    // Depending on the game, draw the appropriate assets
    switch(currentGame){
            
        // Draw the assets for Game 1
        case 0:
            
            //for each user
            for(let i = 0; i < keys.length; i++){
              const user = users[keys[i]];                              // Get the user
              tiles[i].src = '/assets/images/' + user.color + '.png';   // Find itss image in the assets
              ctx.drawImage(tiles[i], user.spaceX, user.scorebar);      // Draw it in the proper place based on the user's current score
            }
            
            // Depending on which state the game is in, draw the correct assets
            switch(gameState){  
                
                // Game State 0 Has no Draws
                case 0:
                    break;
                    
                // Game State 1 Draws the controller facing Right
                case 1:
                    ctx.drawImage(controller2, 200, 400, 105, 100);
                    break;
                
                // Game State 2 Draw the controller facing Left
                case 2:
                    ctx.drawImage(controller1, 200, 400, 105, 100);
                    //ctx.fillRect(200, 450, 50, 50);
                    break;
                    
                // Game State 5 is the Win State for all the games. Draw the win message
                case 5:
                    drawWin();
                    break;
            }
            
            break;
            
        // Draw the assets for Game 2
        case 1:
            //for each user
            for(let i = keys.length-1; i >= 0; i--){
              const user = users[keys[i]];                                                                                  // Get the User
              tiles[i].src = "/assets/images/" + user.color + 'ball.png';                                                   // Get the user's ball image
              ctx.save();                                                                                                   // Save the Context
              ctx.drawImage(tiles[i], 250-user.scorebar, 500-user.scorebar * 2, user.scorebar * 2, user.scorebar * 2);      // Draw the ball at the appropriate size for the user's score
              ctx.restore();                                                                                                // Restore the Context
            }
            
            // Depending on which state the game is in, draw the correct assets
            switch(gameState){
                
                // Game State 0 Has no Draws
                case 0:
                    break;
                
                // Game State 1 Draws the Pump Red
                case 1:
                    if(pumping == true){        // If the user is currently pumping
                        pumpSpot += 1;          // Increase the pump by 1 tick
                        if(pumpSpot >= 15){     // If it's higher than 15
                            pumpSpot = 15;      // It remains at 15
                        }
                    }
                    ctx.fillStyle = 'red';
                    ctx.strokeStyle = 'red';
                    ctx.fillRect(200, 490-pumpSpot, 100, 10);   // Draw the pump as Red
                    break;
                
                // Game State 2 Draws the Pump Blue
                case 2:
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                    ctx.fillRect(200, 490, 100, 10);    // Draw the pump as Blue
                    break;
                
                // Game State 5 is the Win State for all the games. Draw the win message
                case 5:
                    drawWin();
                    break;
            }
            break;
        
        // Draw the assets for Game 3
        case 2:
            
            // Get the Pole Positon of the flag based on the users
            let polePos = 0;
            for(let i = keys.length-1; i >= 0; i--){                                        // Loop through the users and
              const user = users[keys[i]];                                                  // Draw their flags at
              tiles[i].src = '/assets/images/' + user.color + 'flag.png';                   // the appropriate positions
              ctx.drawImage(tiles[i], user.spaceX+130,  user.scorebar - 75, 100, 100);      // Then draw a pole in the correct
              ctx.fillStyle = 'grey';                                                       // Positon for the user
              ctx.fillRect(user.spaceX + 125, 50, 10, 500);
              polePos = user.spaceX;
            }
            
            // Depending on the Game State, draw the correct assets
            switch(gameState){
                    
                // Game State 0 Has no Draws
                case 0:
                    break;
                
                // Game State 1 Draws a blue crank facing down
                case 1:
                    ctx.save();
                    ctx.fillStyle = 'blue';
                    ctx.translate(polePos + 125,450);
                    ctx.rotate(0);
                    ctx.fillRect(0, 0, 5, 50);
                    ctx.beginPath();
                    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
                    ctx.fill();               
                    ctx.restore();
                    break;
                
                // Game State 2 Draws a red crank facing left
                case 2:           
                      ctx.save();
                      ctx.fillStyle = 'red';
                      ctx.translate(polePos + 125,450);
                      ctx.rotate(Math.PI / 2);
                      ctx.fillRect(0, 0, 5, 50);
                      ctx.beginPath();
                      ctx.arc(0, 0, 5, 0, 2 * Math.PI);
                      ctx.fill();
                      ctx.restore();
                    break;
                    
                // Game State 3 Draws a black crank facing up
                case 3:
                      ctx.save();
                      ctx.fillStyle = 'black';
                      ctx.translate(polePos + 125,450);
                      ctx.rotate(Math.PI);
                      ctx.fillRect(0, 0, 5, 50);
                      ctx.beginPath();
                      ctx.arc(0, 0, 5, 0, 2 * Math.PI);
                      ctx.fill();
                      ctx.restore();
                    break;
                    
                // Game State 4 draws a white crank facing right
                case 4:
                      ctx.save();
                      ctx.fillStyle = 'white';
                      ctx.translate(polePos + 125,450);
                      ctx.rotate(3 * Math.PI / 2);
                      ctx.fillRect(0, 0, 5, 50);
                      ctx.beginPath();
                      ctx.arc(0, 0, 5, 0, 2 * Math.PI);
                      ctx.fill();
                      ctx.restore();
                    break;
                    
                // Game State 5 is the Win State for all the games. Draw the win message
                case 5:
                    drawWin();
                    break;
            }
            break;
        
        // Victory Screen is Drawn in the Center
        case 3:
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(overallWinner + " Wins!", 250, 200);
            ctx.fillText("To Play Again, Press Space to Ready.", 250, 220);
    }
    
    // Let the other player know about any movment changes made
    socket.emit('movementUpdate', users[name]);
    
    // Request Animation Frame to draw again
    requestAnimationFrame(draw);
};

// When DrawWin is called, draw the current Winner onto the screen
// Then ask the users to Ready Up
const drawWin = () => {
    ctx.textAlign = "center";
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    ctx.fillText(currentWinner + " Wins!", 250, 200);
    ctx.fillText("Press Space to Move On!", 250, 220);
};