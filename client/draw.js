const draw = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const keys = Object.keys(users);
    for(let i = keys.length-1; i >= 0; i--){
        const user = users[keys[i]];
        tiles[i] = document.getElementById(user.color);
    }

    switch(currentGame) {
      case 0:
        //Testing
        yellow = document.createElement("span");
        yellow.textContent = users[name].color.toUpperCase()+ ' ';
        yellow.style.color = users[name].color;

        instruction = document.getElementById("instruction");
        //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";

        instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the ";
        instruction.appendChild(yellow);
        instruction.innerHTML += 'platform.';
        break;
      
      case 1:
        //Testing
        yellow = document.createElement("span");
        yellow.textContent = users[name].color.toUpperCase()+ ' ';
        yellow.style.color = users[name].color;

        instruction = document.getElementById("instruction");
        //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";

        instruction.innerHTML = "Use Up and Down Arrow Keys to Inflat the ";
        instruction.appendChild(yellow);
        instruction.innerHTML += 'circle.';
        break;
        
      case 2:
        //Testing
        yellow = document.createElement("span");
        yellow.textContent = users[name].color.toUpperCase()+ ' ';
        yellow.style.color = users[name].color;

        instruction = document.getElementById("instruction");
        //instruction.innerHTML = "Use Left and Right Arrow Keys to Raise the " +users[name].color.toUpperCase() +" Platform";

        instruction.innerHTML = "Use Arrow Keys to Raise the ";
        instruction.appendChild(yellow);
        instruction.innerHTML += 'flags.';
        break;
    }
  
    switch(currentGame){
        case 0:
            //for each user
            for(let i = 0; i < keys.length; i++){
              const user = users[keys[i]];
              //ctx.fillStyle = user.color;
              //ctx.strokeStyle = user.color;
              ctx.drawImage(tiles[i], user.spaceX, user.scorebar);
              //ctx.fillRect(user.spaceX, user.scorebar, user.widthX, 500);
            }
            switch(gameState){  
                case 0:
                    break;
                case 1:
                    ctx.drawImage(controller2, 200, 400, 105, 100);
                    //ctx.fillRect(250, 450, 50, 50);
                    break;
                case 2:
                    ctx.drawImage(controller1, 200, 400, 105, 100);
                    //ctx.fillRect(200, 450, 50, 50);
                    break;
                case 5:
                    drawWin();
                    break;
            }
            
            break;
        case 1:
            //for each user
            for(let i = keys.length-1; i >= 0; i--){
              const user = users[keys[i]];
              tiles[i].src = "/assets/images/" + user.color + 'ball.png';
              ctx.save(); 
              ctx.drawImage(tiles[i], 250-user.scorebar, 500-user.scorebar * 2, user.scorebar * 2, user.scorebar * 2);
              ctx.restore();
            }
            switch(gameState){
                case 0:
                    break;
                case 1:
                    if(pumping == true){
                        pumpSpot += 1;
                        if(pumpSpot >= 15){
                            pumpSpot = 15;
                        }
                    }
                    ctx.fillStyle = 'red';
                    ctx.strokeStyle = 'red';
                    ctx.fillRect(200, 490-pumpSpot, 100, 10);
                    break;
                case 2:
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                    ctx.fillRect(200, 490, 100, 10);
                    break;
                case 5:
                    drawWin();
                    break;
            }
            break;
        case 2:
            let polePos = 0;
            for(let i = keys.length-1; i >= 0; i--){
              const user = users[keys[i]];
              tiles[i].src = '/assets/images/' + user.color + 'flag.png';
              ctx.drawImage(tiles[i], user.spaceX+130,  user.scorebar - 75, 100, 100);
              ctx.fillStyle = 'grey';
              ctx.fillRect(user.spaceX + 125, 50, 10, 500);
              polePos = user.spaceX;
            }
            switch(gameState){
                case 0:
                    break;
                case 1:
                    controller1.src = '/assets/images/steeringwheel.png';
                    ctx.save();
                    ctx.translate(125, 300);
                    ctx.drawImage(controller1, 0, 0, 200, 200);
                	ctx.restore(); 
                    break;
                case 2:
                    controller1.src = '/assets/images/steeringwheel2.png';
                    ctx.save();
                    ctx.translate(125, 300);
                    ctx.drawImage(controller1, 0, 0, 200, 200);
                	ctx.restore(); 
                    break;
                case 3:
                    controller1.src = '/assets/images/steeringwheel3.png';
                    ctx.save();
                    ctx.translate(125, 300);
                    ctx.drawImage(controller1, 0, 0, 200, 200);
                	ctx.restore(); 
                    break;
                case 4:
                    controller1.src = '/assets/images/steeringwheel4.png';
                    ctx.save();
                    ctx.translate(125, 300);
                    ctx.drawImage(controller1, 0, 0, 200,200);
                	ctx.restore(); 
                    break;
                case 5:
                    drawWin();
                    break;
            }
            break;
        case 3:
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(overallWinner + " Wins!", 250, 200);
            ctx.fillText("To Play Again, Press Space to Ready.", 250, 220);
    }
    socket.emit('movementUpdate', users[name]);
    requestAnimationFrame(draw);
};

const drawWin = () => {
    ctx.textAlign = "center";
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    ctx.fillText(currentWinner + " Wins!", 250, 200);
    ctx.fillText("Press Space to Move On!", 250, 220);
};