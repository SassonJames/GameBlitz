// fast hashing library
// const xxh = require('xxhashjs');
// node built-in module to start separate processes
// managed by this node process. This means they will
// have separate memory and processing (can run across processor cores)
// const child = require('child_process');
// Character custom class
// const Character = require('./messages/Character.js');
// Custom message class for sending messages to our other process
// const Message = require('./messages/Message.js');

// Character custom class
const Character = require('./messages/Character.js');

// Custom message class for sending messsages to our other process
// const Message = require('./messages/Message.js');

// socketio server instance
let io;

// Which room we are currently in
let currentRoom = 0;

// How many players in the current room
let currentRoomCount = 0;

// const name = '';
const colors = ['brown', 'grey', 'grey', 'red'];

// Maximum players per room
const maxCount = 2;

// All users on the server
const users = {};

// When a user joins the server
const onJoined = (sock) => {
  const socket = sock;

  // when the user joins
  socket.on('join', (data) => {
    // add user to the count
    currentRoomCount++;
    let userName = data.name;
    let loopNum = 0;

    // If the userName is taken, add a numeral to the end until it is not
    while (users[userName] !== undefined) {
      userName += loopNum;
      loopNum++;
    }

    // If we changed the username, let the user know
    if (userName !== data.name) {
      socket.emit('nameChange', userName);
    }

    // Set the user's name
    users[userName] = userName;
    socket.name = userName;

    // Have the user join the room
    socket.join(`room${currentRoom}`);

    // Our current room is that player's room
    socket.room = currentRoom;

    // Set up the user's information to be tracked by them and the server
    users[userName] = new Character(userName);
    users[userName].currentRoom = currentRoom;
    users[userName].currentRoomCount = currentRoomCount;
    users[userName].spaceX = (currentRoomCount - 1) * 250;
    users[userName].widthX = users[userName].canvasWidth / maxCount;
    users[userName].color = colors[currentRoomCount - 1];

    // Send the user's information back to them
    socket.emit('setUser', users[userName]);


    // if there are 2 people in the room, start the game
    // and change the name of the room for the next party
    if (currentRoomCount >= 2) {
      if (currentRoomCount === 2) {
        users[userName].currentRoomCount = 2;
        io.sockets.in(`room${currentRoom}`).emit('startRoom', {});
        currentRoom++;
      }
      currentRoomCount = 0;
    }
  });
};

// Update the other players in the room when
// a user has updated their movement
const onUpdateMovement = (sock) => {
  const socket = sock;

  // When recieving movement update
  socket.on('movementUpdate', (data) => {
    // update the user's info

    if (users[socket.name]) {
      // update the timestamp of the last change for this character
      users[socket.name].lastUpdate = new Date().getTime();

      // update the scorebar of the user
      users[socket.name].scorebar = data.scorebar;

      // notify everyone of the user's updated movement
      socket.broadcast.to(`room${users[socket.name].currentRoom}`).emit('updatedMovement', users[socket.name]);
    }
  });
};

// When the user needs to reset the scores,
// tell everyone to start the next game
const onResetScores = (sock) => {
  const socket = sock;

  // Tell all users to start the next game
  // when the scores are reset
  socket.on('resetScores', () => {
    if (users[socket.name]) {
      io.sockets.in(`room${users[socket.name].currentRoom}`).emit('nextGame');
    }
  });
};

// When a user is ready, let the other user know
const onReady = (sock) => {
  const socket = sock;

  socket.on('ready', () => {
    socket.broadcast.to(`room${users[socket.name].currentRoom}`).emit('playerReady');
  });
};

// When a user has won the current game, let the other user know
const onVictory = (sock) => {
  const socket = sock;

  socket.on('victory', (data) => {
    socket.broadcast.to(`room${users[socket.name].currentRoom}`).emit('victory', data);
  });
};

// When a game has ended, send the score the other player
// for comparison to determine a winner
const onGameEnd = (sock) => {
  const socket = sock;

  socket.on('gameEnd', (data) => {
    socket.broadcast.to(`room${users[socket.name].currentRoom}`).emit('getScore', data);
  });
};

// When a winner is determined,
// Let the other user know who the winner is
const onWinner = (sock) => {
  const socket = sock;

  socket.on('winner', (data) => {
    socket.broadcast.to(`room${users[socket.name].currentRoom}`).emit('sendWinner', data);
  });
};

// When a player disconnects from the server
// Have them leave the room and then delete that user
const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    socket.leave(`room${socket.room}`);

    delete users[socket.name];
  });
};

// function to setup our socket server
const setupSockets = (ioServer) => {
  // set our io server instance
  io = ioServer;

  // Set up all the socket commands
  io.sockets.on('connection', (socket) => {
    onJoined(socket);
    onUpdateMovement(socket);
    onResetScores(socket);
    onReady(socket);
    onVictory(socket);
    onGameEnd(socket);
    onWinner(socket);
    onDisconnect(socket);
  });
};
module.exports.setupSockets = setupSockets;
