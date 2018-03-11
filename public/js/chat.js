var socket = io.connect("165.227.60.172/chat");
// var socket = io.connect("http://192.168.0.2:8080/paint");


var messages = document.getElementById('messages');
var form = document.getElementById('form');
var val = document.getElementById('m');

var username = null;
var users = [];

function postMessage(nameForClass, messageBody, placeToAppend){
  var messageToPost = document.createElement('li');
  messageToPost.className = nameForClass;
  messageToPost.innerHTML = messageBody;
  placeToAppend.appendChild(messageToPost);
}

form.addEventListener('submit', function(event){
  event.preventDefault();
  if(!username){
    var name = document.forms[0][0].value;
    socket.emit('add user', name);
    document.forms[0][0].value='';
  }else{
    var text = document.forms[0][0].value;
    socket.emit('chat message', username + ': ' + text);
    document.forms[0][0].value='';
  }
});

socket.on('set name', function(name){
  username = name;
});

socket.on('login', function(userData){
  users.push(userData.username);
});

socket.on('logout', function(userData){
  users.splice(users.indexOf(userData.username), 1);
});

socket.on('chat message', function(message){
  postMessage('user-msg', message, messages);
  updateScroll();
});

socket.on('admin', function(message){
  postMessage('admin', message, messages);
});