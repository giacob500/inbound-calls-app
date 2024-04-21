// Server-side (app.js)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let peopleList = ['Alice', 'Bob', 'Charlie', 'David'];
let currentIndex = 0;

io.on('connection', (socket) => {
  // Send initial list to the client
  socket.emit('updateList', peopleList);

  // Handle "Next" button click
  socket.on('next', () => {
    currentIndex = (currentIndex + 1) % peopleList.length;
    io.emit('updateCurrent', peopleList[currentIndex]);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
