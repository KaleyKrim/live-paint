var socket = io.connect("165.227.60.172/jelly");
// var socket = io.connect("http://192.168.0.2:8080/jelly");
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var playerScoreDivs = document.querySelectorAll('div.player-score');
var playerImgDivs = document.querySelectorAll('div.player-img');

function renderScores(playerList){
  let playerArr = Object.keys(playerList).map((key) => {
    return [key, playerList[key]];
  });
  for(let i = 0; i < playerImgDivs.length; i++){
    playerImgDivs[i].style.backgroundImage = null;
    playerScoreDivs[i].innerHTML = null;
  }

  for(let i = 0; i < playerArr.length; i++){
    playerImgDivs[i].style.backgroundImage = `url(${playerArr[i][1].character})`;
    playerScoreDivs[i].innerHTML = playerArr[i][1].points;
  }
}

function renderImg(xCoord, yCoord, source, size){

  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, xCoord, yCoord, size, size);
  }
  img.src = source;
}

document.addEventListener('keydown', move);

function move(e){
  switch(e.key){
    case 'ArrowDown':
      socket.emit('down');
      break
    case 'ArrowUp':
      socket.emit('up');
      break
    case 'ArrowLeft':
      socket.emit('left');
      break
    case 'ArrowRight':
      socket.emit('right');
      break
  }
}

function updateGame(state){

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  players = state.players;
  target = state.target;

  let playerArray = Object.keys(state.players).map((key) => {
    return [key, state.players[key]]
  });
  playerArray.forEach((player) => {
    if(player[0] != socket.id){
      renderImg(player[1].x, player[1].y, player[1].character, player[1].size);
    }
  });

  renderScores(players);

  renderImg(state.players[socket.id].x, state.players[socket.id].y, state.players[socket.id].character, state.players[socket.id].size);
  renderImg(state.target.x, state.target.y, state.target.source, 50);
}

socket.on('gameUpdate', function(data){
  updateGame(data);
});