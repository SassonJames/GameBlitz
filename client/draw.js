const draw = () => {
  
    ctx.clearRect(0,0, canvas.width, canvas.height);

  
    const keys = Object.keys(users);
    
    switch(currentGame){
        case 0:
            //for each user
            for(let i = 0; i < keys.length; i++){
              const user = users[keys[i]];
              ctx.fillStyle = user.color;
              ctx.strokeStyle = user.color;
              ctx.fillRect(user.spaceX, user.scorebar, user.widthX, 500);     
            }
            if(users[name].scorebar <= 0){
                scoreBar = 0; 
                ctx.fillStyle = 'black';
                ctx.font = "20px Arial";
                ctx.fillText("Congratulations!", 180, 200);
                ctx.fillText("Press Space to Move On", 150, 250);
                gameState = 3;
            }
            switch(gameState){  
                case 0:
                    break;
                case 1:
                    ctx.fillStyle = 'red';
                    ctx.strokeStyle = 'red';
                    ctx.fillRect(200, 450, 50, 50);
                    break;
                case 2:
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                    ctx.fillRect(250, 450, 50, 50);
                    break;
            }
            break;
        case 1:
            //for each user
            for(let i = 0; i < keys.length; i++){
              const user = users[keys[i]];
              ctx.fillStyle = user.color;
              ctx.strokeStyle = user.color;
              ctx.beginPath();
              ctx.arc(250,500-scoreBar,scoreBar,0,2*Math.PI);
              ctx.fill();
              ctx.stroke();
            }
            if(scoreBar >= 250){
                scoreBar = 250;
                ctx.fillStyle = 'black';
                ctx.font = "20px Arial";
                ctx.fillText("Congratulations!", 180, 200);
                ctx.fillText("Press Space to Move On!", 150, 250);
                gameState = 3;
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
                case 2:
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                    ctx.fillRect(200, 490, 100, 10);
            }
            break;
        case 2:
            ctx.font = "30px Arial";
            ctx.fillText("Game 3 Here",200,220);
            break;
    }
    socket.emit('movementUpdate', users[name]);
    requestAnimationFrame(draw);
};