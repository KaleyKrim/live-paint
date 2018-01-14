const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);
const path = require('path');

let currentCanvas = [];

for(let i = 0; i < 625; i++){
  currentCanvas.push['#ffffff'];
}

app.use(express.static(path.join(__dirname, 'public')));

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

io.on('connection', (socket) => {
  socket.emit('canvas data', currentCanvas);

  socket.on('paint', (paintData) => {
    currentCanvas[paintData.index] = paintData.color;
    io.emit('paint', {
      index : paintData.index,
      color : paintData.color
    });
  });

  socket.on('clear', () => {
    for(let i = 0; i < currentCanvas.length; i++){
      currentCanvas[i] = "#ffffff";
    }
    io.emit('clear');
  });
});