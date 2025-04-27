const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join', roomName => {
    socket.join(roomName);
    socket.to(roomName).emit('new-user', socket.id);

    socket.on('offer', (userId, description) => {
      io.to(userId).emit('offer', socket.id, description);
    });

    socket.on('answer', (userId, description) => {
      io.to(userId).emit('answer', socket.id, description);
    });

    socket.on('ice-candidate', (userId, candidate) => {
      io.to(userId).emit('ice-candidate', socket.id, candidate);
    });

    socket.on('chat', message => {
      io.to(roomName).emit('chat', message);
    });

    socket.on('disconnect', () => {
      socket.to(roomName).emit('user-disconnected', socket.id);
    });
  });
});

http.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
