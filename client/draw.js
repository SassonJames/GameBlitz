const draw = () => {
  
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';
  
    const keys = Object.keys(users);

    //for each user
    for(let i = 0; i < keys.length; i++){
      const user = users[keys[i]];
      ctx.fillRect(user.spaceX, user.scorebar, user.widthX, 500);     
    }
  
    if(scoreBar <= 0){
        scoreBar = 0; 
            ctx.fillStyle = 'white';
            ctx.font = "20px Arial";
            ctx.fillText("Congratulations!", 180, 200);
            ctx.fillText("Press Space to Restart", 150, 250);
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
    socket.emit('movementUpdate', users[name]);
    requestAnimationFrame(draw);
};