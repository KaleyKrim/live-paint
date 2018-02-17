function makeGrid(boxes, className, parentDiv){
  for (var x=0; x<boxes; x++){
    var row = document.createElement("div");
    row.className = className;
    parentDiv.appendChild(row);
  }
}

function fillColorPalette(pixels, colors){
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].style.backgroundColor = colors[i];
  }
};

function hexc(colorval) {
  var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  delete(parts[0]);
  for (var i = 1; i <= 3; ++i) {
      parts[i] = parseInt(parts[i]).toString(16);
      if (parts[i].length == 1) parts[i] = '0' + parts[i];
  }
  color = '#' + parts.join('');
  return color;
}

function savePic(title, picture){
  axios.post('/api/paintings', {
    title: title,
    data: picture
  });
}