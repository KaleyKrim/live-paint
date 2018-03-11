var socket = io.connect("165.227.60.172/paint");
// var socket = io.connect("http://192.168.0.2:8080/paint");


var pixelPainter = (function(){

  var canvas = document.getElementById("canvas");
  var sidebar = document.getElementById("palette");
  var userCount = document.getElementById('user-count');
  var toolTable = document.getElementsByClassName("tools");
  var palettePixels = document.getElementsByClassName("palette-pixel");
  var canvasCells = document.getElementsByClassName("canvas-pixel");
  var colorArray = ["#000000", "#990066", "#330099", "#000066", "#0033ff", "#0099ff", "#00ffcc", " #009966", " #00cc00", " #ffff00", "#ff9900", "#ff6666", "#ff0000", "#ff3366", "#ff99cc", "#ccffff", "#ccccff", "#ffffff"];
  var currentColor = colorArray[0];
  var isDrawing = false;
  var title = null;
  var savedPicture = [];

  makeGrid(625, "canvas-pixel", canvas);
  makeGrid(18, "palette-pixel", sidebar);
  makeGrid(3, "tools", sidebar);

  fillColorPalette(palettePixels, colorArray);

  (function (){
    for (var i = 0; i < palettePixels.length; i++){
      palettePixels[i].addEventListener("click", selectColor);
    }
  }());

  toolTable[0].addEventListener("click", eraseColor);
  toolTable[1].addEventListener("click", clearCanvas);
  toolTable[2].addEventListener("click", getPicData);


  function selectColor(x){
    currentColor = x.target.style.backgroundColor;
  }

  (function (){
    for (var i = 0; i < canvasCells.length; i++) {
      canvasCells[i].addEventListener("click", clickColor);
      canvasCells[i].addEventListener("mouseover", paintColor);
    }
  }());

  canvas.addEventListener("mousedown", drawMe);
  canvas.addEventListener("onclick", drawMe);
  document.body.addEventListener("mouseup", stopDraw);

  socket.on('canvas data', function(data){
    for (var i = 0; i < canvasCells.length; i++){
     canvasCells[i].style.backgroundColor = data[i];
    }
  });

  socket.on('paint', function(data){
    canvasCells[data.index].style.backgroundColor = data.color;
  });

  socket.on('clear', function(){
    for (var i = 0; i < canvasCells.length; i++){
      canvasCells[i].style.backgroundColor = "#ffffff";
    }
  });

  socket.on('user count', function(count){
    var realCount = count/2;
    if((count/2) < 2){
      userCount.innerHTML = `You're the only user online right now ;( Too bad!`;
    }else{
      userCount.innerHTML = `There are ${count/2} users online right now! Party time!`;
    }
  });

  function paintColor(){
    if (isDrawing){
      var index;
      this.style.backgroundColor = currentColor;
      for(var i = 0; i < canvasCells.length; i++){
        if (canvasCells[i] === this) {
          index = i;
        }
      }
      var data = {
        index: index,
        color: currentColor
      };
      socket.emit('paint', data);
    }
  }

  function clickColor(){
    this.style.backgroundColor = currentColor;
    var index;
    for(var i = 0; i < canvasCells.length; i++){
      if (canvasCells[i] === this) {
        index = i;
      }
    }
    var data = {
      index: index,
      color: currentColor
    };
    socket.emit('paint', data);
  }

  function eraseColor(){
    currentColor = "#ffffff";
  }

  function drawMe (){
    isDrawing  = true;
  }

  function stopDraw (){
    isDrawing = false;
  }

  function clearCanvas(){
    for (var i = 0; i < canvasCells.length; i++){
      canvasCells[i].style.backgroundColor = "#ffffff";
    }
    socket.emit('clear');
  }

  function getPicData(){
    title = null;
    savedPicture = [];
    for (var i = 0; i < canvasCells.length; i++){
      if(!(canvasCells[i].style.backgroundColor)){
        savedPicture.push('#ffffff');
      }else{
        savedPicture.push(hexc(canvasCells[i].style.backgroundColor));
      }
    }
    title = prompt("What do you want to title it? (Keep it short!!)");
    if(title && savedPicture.length > 0){
      savePic(title, savedPicture.toString());
    }
  }

}());