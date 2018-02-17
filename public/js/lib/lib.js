function updateScroll(){
  var element = document.getElementById("chat");
  element.scrollTop = element.scrollHeight;
}

function errorCallback(e) {
  console.log('Error!', e);
};