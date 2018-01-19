var gallery = document.getElementById('gallery-space');

function makeCanvas(data){
  var canvas = document.createElement('div');
  canvas.className = 'canvas';
  gallery.appendChild(canvas);

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
    console.log(response.data);

    for(var i = 0; i < paintings.length; i++){

      makeCanvas(paintings[i].data.split(','));

    }
  });
}

window.onload = getPaintings;

console.log('smoke test');