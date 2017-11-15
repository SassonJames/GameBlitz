const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

const io = socketio(app);

io.sockets.on('connection', (socket) => {
  socket.on('join', () => {
    console.log('A Player Has Joined the Room');
    socket.join('room1');
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});
