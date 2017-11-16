// fast hashing library
const xxh = require('xxhashjs');
// node built-in module to start separate processes
// managed by this node process. This means they will
// have separate memory and processing (can run across processor cores)
//const child = require('child_process');
// Character custom class
//const Character = require('./messages/Character.js');
// Custom message class for sending messages to our other process
//const Message = require('./messages/Message.js');

// object to hold user character objects
//const charList = {};

//socketio server instance
let io;


// function to setup our socket server
const setupSockets = (ioServer) => {
  // set our io server instance
  io = ioServer;

  io.sockets.on('connection', (socket) => {
    socket.on('join', () => {
      console.log('A Player Has Joined the Room');
      socket.join('room1');
    });

    socket.on('disconnect', () => {
      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
