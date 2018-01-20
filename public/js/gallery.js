var gallery = document.getElementById('gallery-space');

function makeDiv(className, parentDiv){
  var div = document.createElement('div');
  div.className = className;
  parentDiv.appendChild(div);
  return div;
}

function makeCanvas(title, data){
  var div = makeDiv('piece', gallery);
  var titleDiv = makeDiv('title', div);
  titleDiv.innerHTML = title;
  var canvas = makeDiv('canvas', div);

  for (var x = 0; x < 625; x++){
    var row = document.createElement("div");
    row.className = 'canvas-pixel';
    canvas.appendChild(row);
    row.style.backgroundColor = data[x];
  }
}

function getPaintings(){
  console.log('hello??');
  axios.get('/api/paintings')
  .then(function (response) {
    var paintings = response.data;
    console.log(paintings);
    for(var i = 0; i < paintings.length; i++){
      makeCanvas(paintings[i].title, paintings[i].data.split(','));
    }
  });
}

window.onload = getPaintings;

console.log('smoke test');