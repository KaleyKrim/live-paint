var socket = io.connect("localhost:8080/");

//"192.168.0.9:8080/"

var pixelPainter = (function(){

  var canvas = document.getElementById("canvas");
  var sidebar = document.getElementById("palette");

  var toolTable = document.getElementsByClassName("tools");
  var colorSwatches = document.getElementsByClassName("palette-pixel");
  var canvasCells = document.getElementsByClassName("canvas-pixel");

  var colorArray = ["#ffffff", "#FF6AD5", "#C774E8", "#AD8CFF", "#8795E8", "#94D0FF", "#FFD0DE", "#FF3DD1", "#EA40AA", "#C0FBE7", "#57CDBA", "#77FED5", "#000000", "#F5D400", "#32006C", "#AF00FF", "#00F3FF", "#2C00FF"];
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
  makeGrid(4, "tools", sidebar);

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

  toolTable[0].innerHTML = "E R A S E";
  toolTable[1].innerHTML = "C L E A R";
  toolTable[2].innerHTML = "S A V E";
  toolTable[3].innerHTML = "L O A D";
  toolTable[0].addEventListener("click", eraseColor);
  toolTable[1].addEventListener("click", clearCanvas);
  toolTable[2].addEventListener("click", savePic);
  toolTable[3].addEventListener("click", loadPic);


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

  socket.on('paint', function(data){
    console.log(data);
    canvasCells[data.index].style.backgroundColor = data.color;
  })

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
  }

  function savePic(){
    savedPicture = [];
    for (var i = 0; i < canvasCells.length; i++){
      savedPicture.push(canvasCells[i].style.backgroundColor);
    }

  }

  function loadPic(){
    for (var i =0; i < canvasCells.length; i++){
     canvasCells[i].style.backgroundColor = savedPicture[i];
    }
  }
}());