function postMessage(message, className){
  var newMessage = document.createElement('li');
  newMessage.className = className;
  newMessage.innerHTML = message;
  messages.appendChild(newMessage);
}

function updateScroll(){
  var element = document.getElementById("chat");
  element.scrollTop = element.scrollHeight;
}

function errorCallback(e) {
  console.log('Error!', e);
};