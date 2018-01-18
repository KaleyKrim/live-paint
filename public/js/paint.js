var socket = io.connect("192.168.0.2:8080/");

var pixelPainter = (function(){

  var canvas = document.getElementById("canvas");
  var sidebar = document.getElementById("palette");
  var userCount = document.getElementById('user-count');

  var toolTable = document.getElementsByClassName("tools");
  var colorSwatches = document.getElementsByClassName("palette-pixel");
  var canvasCells = document.getElementsByClassName("canvas-pixel");

  var colorArray = ["#000000", "#990066", "#330099", "#000066", "#0033ff", "#0099ff", "#00ffcc", " #009966", " #00cc00", " #ffff00", "#ff9900", "#ff6666", "#ff0000", "#ff3366", "#ff99cc", "#ccffff", "#ccccff", "#ffffff"];
  var currentColor = colorArray[0];
  var isDrawing = false;
  var savedPicture = [];

  function makeGrid(boxes, className, parentDiv){
    for (var x=0; x<boxes; x++){
      var row = document.createElement("div");
      row.className = className;
      parentDiv.appendChild(row);
    }
  }

  makeGrid(625, "canvas-pixel", canvas);
  makeGrid(18, "palette-pixel", sidebar);
  makeGrid(3, "tools", sidebar);

  (function fillColorPalette(arr){
    for (var i = 0; i < arr.length; i++) {
      arr[i].style.backgroundColor = colorArray[i];
    }
  }(colorSwatches));

  (function (){
    for (var i = 0; i < colorSwatches.length; i++){
      colorSwatches[i].addEventListener("click", selectColor);
    }
  }());

  // toolTable[0].style.backgroundImage = "url(./assets/erase.png)";;
  // toolTable[1].innerHTML = "C L E A R";
  // toolTable[2].innerHTML = "Save to Gallery";
  toolTable[0].addEventListener("click", eraseColor);
  toolTable[1].addEventListener("click", clearCanvas);
  toolTable[2].addEventListener("click", savePic);

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
    console.log(realCount);
    console.log(count/2);
    if((count/2) < 2){
      userCount.innerHTML = `You're the only user online right now ;( Too bad!`;
    }else{
      userCount.innerHTML = `There are ${count/2} users online right now! Party time!`
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
        color: this.style.backgroundColor
      };

      socket.emit('paint', data);

    }
  }

  function clickColor(){
    this.style.backgroundColor = currentColor;
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

  function savePic(){
    savedPicture = [];
    for (var i = 0; i < canvasCells.length; i++){
      savedPicture.push(canvasCells[i].style.backgroundColor);
    }

  }

}());