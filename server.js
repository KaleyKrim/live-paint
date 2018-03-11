const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);
const jelly = io
  .of('/jelly');

const paintSocket = io
  .of('/paint');

const path = require('path');
const bodyParser = require('body-parser');

const db = require('./models');
const api = require('./api');

const game = require('./public/js/game');
const targetPath = "game-assets/targets/";

const users = {};
let userCount = 0;
let currentCanvas = [];

const targets = [{source: `${targetPath}watermelon.png`, points: 2}, {source: `${targetPath}tomato.png`, points: 1}, {source: `${targetPath}tomato2.png`, points: 0, special: 2}, {source: `${targetPath}tomato3.png`, points: 1}];

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ "extended" : false }));
app.use(bodyParser.json());
app.use('/api', api);

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
  db.sequelize.sync({ force: false });
  userCount = 0;
  currentCanvas = [];
  for(let i = 0; i < 625; i++){
    currentCanvas.push['#ffffff'];
  }
});


paintSocket.on('connection', (socket) => {
  console.log('paint connected');
  socket.emit('canvas data', currentCanvas);

  users[socket.id] = null;
  userCount++;
  paintSocket.emit('user count', userCount);
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
      paintSocket.emit('admin', `${socket.username} has joined the chat!`);
    }
  });

  socket.on('chat message', (msg) => {
    paintSocket.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    userCount--;
    delete users[socket.id];
    paintSocket.emit('logout', {
      username: socket.username,
      userCount : userCount
    });
    paintSocket.emit('user count', userCount);
    console.log('user disconnected');
  });

  socket.on('paint', (paintData) => {
    currentCanvas[paintData.index] = paintData.color;
    paintSocket.emit('paint', {
      index : paintData.index,
      color : paintData.color
    });
  });

  socket.on('clear', () => {
    for(let i = 0; i < currentCanvas.length; i++){
      currentCanvas[i] = "#ffffff";
    }
    paintSocket.emit('clear');
  });
});

jelly.on('connection', (socket) => {
  console.log(`${socket.id} has connected!`);

  if (Object.keys(game.players).length === 0) {
    game.shuffleTarget(targets[Math.floor(Math.random()*targets.length)]);
  }
  let freeCharacter = game.findFreeCharacter(game.characters);
  game.players[socket.id] = game.makeNewCharacter(freeCharacter);
  jelly.emit('gameUpdate', {target: game.target, players: game.players});

  socket.on('up', () => {
    game.gameStateUpdates(game, socket, targets);
    game.infiniteUp(game.players[socket.id]);
    game.goUp(game.players[socket.id]);
    jelly.emit('gameUpdate', {target: game.target, players: game.players});
  });

  socket.on('down', () => {
    game.gameStateUpdates(game, socket, targets);
    game.infiniteDown(game.players[socket.id]);
    game.goDown(game.players[socket.id]);
    jelly.emit('gameUpdate', {target: game.target, players: game.players});
  });

  socket.on('right', () => {
    game.gameStateUpdates(game, socket, targets);
    game.infiniteRight(game.players[socket.id]);
    game.goRight(game.players[socket.id]);
    jelly.emit('gameUpdate', {target: game.target, players: game.players});
  });

  socket.on('left', () => {
    game.gameStateUpdates(game, socket, targets);
    game.infiniteLeft(game.players[socket.id]);
    game.goLeft(game.players[socket.id]);
    jelly.emit('gameUpdate', {target: game.target, players: game.players});
  });

  socket.on('disconnect', () => {
    let userChar = game.players[socket.id].character;
    game.characters[userChar] = false;
    delete game.players[socket.id];
    jelly.emit('gameUpdate', {target: game.target, players: game.players});
  });
});