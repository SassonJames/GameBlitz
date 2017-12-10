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

// const roomList = {};
let currentRoom = 0;
let currentRoomCount = 0;
// const name = '';
const colors = ['brown', 'grey', 'grey', 'red'];
const maxCount = 2;
const users = {};


const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', (data) => {
    // add user to the count
    currentRoomCount++;
    let userName = data.name;
    let loopNum = 0;

    while (users[userName] !== undefined) {
      userName += loopNum;
      loopNum++;
    }

    if (userName !== data.name) {
      socket.emit('nameChange', userName);
    }
    users[userName] = userName;
    socket.name = userName;


    socket.join(`room${currentRoom}`);

    // if the room isn't in the roomlist
    // if (!roomList[`room${currentRoom}`]) {
    // console.log(`adding room ${currentRoom} to roomList`);
    // roomList[`room${currentRoom}`] = {};
    // roomList[`room${currentRoom}`].userList = {};
    // }
    socket.room = currentRoom;
    // Test see room list
    // roomList:
    // { room0: //
    //  { userList: //
    //    { '1': 'A',
    //      '2': 'B'
    //    }
    //  }
    // }
    // Add their username to the user list

    // roomList[`room${currentRoom}`].userList[currentRoomCount] = new Character(data.name);
    users[userName] = new Character(userName);
    users[userName].currentRoom = currentRoom;
    users[userName].currentRoomCount = currentRoomCount;
    users[userName].spaceX = (currentRoomCount - 1) * 250;
    users[userName].widthX = users[userName].canvasWidth / maxCount;
    users[userName].color = colors[currentRoomCount - 1];

    socket.emit('setUser', users[userName]);


    // if there are 3 people in the room, start the game
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

/* const onUpdateScore = (sock) => {
  const socket = sock;

  socket.on('updateScorebar', (data) => {
    socket.broadcast.to(`room${socket.room}`).emit('recieveScore', data);
  });
};
*/
const onUpdateMovement = (sock) => {
  const socket = sock;

  socket.on('movementUpdate', (data) => {
    // update the user's info
    // NOTICE: THIS IS NOT VALIDED AND IS UNSAFE

    // charList[socket.hash].x = data.x;

    if (users[socket.name]) {
      // update the timestamp of the last change for this character
      users[socket.name].lastUpdate = new Date().getTime();
      users[socket.name].scorebar = data.scorebar;

      // notify everyone of the user's updated movement
      io.sockets.in(`room${users[socket.name].currentRoom}`).emit('updatedMovement', users[socket.name]);
    }
  });
};

const onResetScores = (sock) => {
  const socket = sock;

  socket.on('resetScores', () => {
    if (users[socket.name]) {
      io.sockets.in(`room${users[socket.name].currentRoom}`).emit('nextGame');
    }
  });
};

const onReady = (sock) => {
  const socket = sock;

  socket.on('ready', () => {
    socket.broadcast.to(`room${users[socket.name].currentRoom}`).emit('playerReady');
  });
};

const onGameEnd = (sock) => {
  const socket = sock;

  socket.on('gameEnd', (data) => {
    socket.broadcast.to(`room${users[socket.name].currentRoom}`).emit('getScore', data);
  });
};

const onWinner = (sock) => {
  const socket = sock;

  socket.on('winner', (data) => {
    socket.broadcast.to(`room${users[socket.name].currentRoom}`).emit('sendWinner', data);
  });
};


const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    // console.log(`${socket.name} left`);
    socket.leave(`room${socket.room}`);

    delete users[socket.name];
  });
};

// function to setup our socket server
const setupSockets = (ioServer) => {
  // set our io server instance
  io = ioServer;

  io.sockets.on('connection', (socket) => {
    onJoined(socket);
    onUpdateMovement(socket);
    onResetScores(socket);
    onReady(socket);
    onGameEnd(socket);
    onWinner(socket);
    onDisconnect(socket);
  });
};
module.exports.setupSockets = setupSockets;
