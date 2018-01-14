const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

io.on('connection', (socket) => {
  socket.on('paint', (paintData) => {
    console.log(paintData);
    io.emit('paint', {
      index : paintData.index,
      color : paintData.color
    });
  });

  socket.on('clear', () => {
    io.emit('clear');
  });
});