//when we receive a character update
const update = (data) => {
  //if we do not have that character (based on their id)
  //then add them
  if(!squares[data.hash]) {
    squares[data.hash] = data;
    return;
  }

  //if the update is for our own character (we dont need it)
  //Although, it could be used for player validation


  //if we received an old message, just drop it
  if(squares[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  if(data.hash === hash) {
    const square = squares[data.hash];
    square.speedX = data.speedX;
    square.speedY = data.speedY;
  }
  else{
    //grab the character based on the character id we received
    const square = squares[data.hash];

  }
  //console.dir(data.speedX)
};


//function to remove a character from our character list
const removeUser = (data) => {
  //if we have that character, remove them
  if(squares[data.hash]) {
    delete squares[data.hash];
  }
};

const setUser = (data) => {
  hash = data.hash; //set this user's hash to the unique one they received
  squares[hash] = data; //set the character by their hash
  requestAnimationFrame(redraw); //start animating
};

//update this user's positions based on keyboard input
const updatePosition = () => {
  const square = squares[hash];


  //reset this character's alpha so they are always smoothly animating
  square.alpha = 0.05;

  //send the updated movement request to the server to validate the movement.
  socket.emit('movementUpdate', square);
};

const ready = () => {
    let loadingPart = document.querySelector('#loadingPart');
    let user = document.querySelector("#username").value;
    loginPart.innerHTML = "Waiting for the second user...";
        
    if(!user) {
        user = 'Unknown';
    }
        
    socket.emit('join', {name: user});

    socket.on('startRoom', (data) => {
        loadingPart.style.display = 'none';
        myRoom = data.room;
        let appPart = document.querySelector('#appPart');
        appPart.style.display = 'block';

        setupGame();
    });
  

    requestAnimationFrame(draw);
    
};