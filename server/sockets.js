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

// object to hold user character objects
// const charList = {};

// socketio server instance
let io;

const roomList = {};
let currentRoom = 0;
let currentRoomCount = 0;

const users = {};



const onJoined = (sock) => {
  const socket = sock;
  
  socket.on('join', (data) => {
    //add user to the count
    currentRoomCount++;


    users[data.name] = data.name;
    socket.name = data.name;

    
    socket.join(`room${currentRoom}`);

    //if the room isn't in the roomlist
    if(!roomList[`room${currentRoom}`]){
        console.log(`adding room ${currentRoom} to roomList`);
        roomList[`room${currentRoom}`] = {};
        roomList[`room${currentRoom}`].userList = {};
        socket.room = currentRoom;
    };

    //Add their username to the user list
    roomList[`room${currentRoom}`].userList[currentRoomCount] = data.name;


    // if there are 3 people in the room, start the game
    // and change the name of the room for the next party
    if(currentRoomCount >= 2){
      if(currentRoomCount === 2){
        io.sockets.in(`room${currentRoom}`).emit('startRoom', {room: currentRoom});
        currentRoom++;
      }
      currentRoomCount = 0;
    }
  });

};

const onDisconnect = (sock) => {
  const socket = sock;
  
  socket.on('disconnect', () => {
    console.log(`${socket.name} left`);
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
    onDisconnect(socket);
  });
  
};

module.exports.setupSockets = setupSockets;
