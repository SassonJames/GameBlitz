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
                case 5:
                    drawWin();
                    break;
            }
            
            break;
        case 1:
            //for each user
            for(let i = keys.length-1; i >= 0; i--){
              const user = users[keys[i]];
              ctx.fillStyle = user.color;
              ctx.strokeStyle = user.color;
              ctx.beginPath();
              ctx.arc(250,500-user.scorebar,user.scorebar,0,2*Math.PI);
              ctx.fill();
              ctx.stroke();
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
              ctx.fillStyle = 'grey';
              ctx.fillRect(user.spaceX + 125, 50, 10, 500);
              ctx.fillStyle = user.color;
              ctx.strokeStyle = user.color;
              ctx.beginPath();
              ctx.moveTo(user.spaceX+130, user.scorebar);
              ctx.lineTo(user.spaceX+130, user.scorebar-50);
              ctx.lineTo(user.spaceX+200, user.scorebar-25);
              ctx.fill();
              ctx.stroke();
              polePos = user.spaceX;
            }
            switch(gameState){
                case 0:
                    break;
                case 1:
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(polePos+125, 450, 5, 50);
                    break;
                case 2:
                    ctx.fillStyle = 'red';
                    ctx.fillRect(polePos+75, 450, 50, 5);
                    break;
                case 3:
                    ctx.fillStyle = 'black';
                    ctx.fillRect(polePos+125, 400, 5, 50);
                    break;
                case 4:
                    ctx.fillStyle = 'white';
                    ctx.fillRect(polePos+125, 450, 50, 5);
                    break;
                case 5:
                    drawWin();
                    break;
            }
            break;
        case 3:
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