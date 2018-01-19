const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);

const path = require('path');
const bodyParser = require('body-parser');

const db = require('./models')
const api = require('./api');

const users = {};
let userCount = 0;
let currentCanvas = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ "extended" : false }));
app.use(bodyParser.json());
app.use('/api', api);

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
  db.sequelize.sync({ force: true });
  userCount = 0;
  currentCanvas = [];
  for(let i = 0; i < 625; i++){
    currentCanvas.push['#ffffff'];
  }
});

io.on('connection', (socket) => {
  socket.emit('canvas data', currentCanvas);
  users[socket.id] = null;
  userCount++;
  io.emit('user count', userCount);
  socket.emit('admin', `Oh, hello there. What's your name?`);

  socket.on('add user', (name)=> {
    let currentUsers = Object.keys(users).map(function(key) {
      return users[key];
    });
    if(currentUsers.indexOf(name.toLowerCase()) >= 0){
      socket.emit('admin', `You can't be ${name}, the REAL ${name} is already here chatting. Who are you REALLY?`);
    }else{
      socket.username = name.toLowerCase();
      users[socket.id] = name.toLowerCase();
      socket.emit('set name', name);
      io.emit('admin', `${socket.username} has joined the chat!`);
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    userCount--;
    delete users[socket.id];
    io.emit('logout', {
      username: socket.username,
      userCount : userCount
    });
    io.emit('user count', userCount);
    console.log('user disconnected');
  });

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