var socket = io.connect("localhost:8080/");

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var val = document.getElementById('m');

var username = null;
var users = [];

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
  userCount = userData.userCount;
  console.log(users);
});

socket.on('logout', function(userData){
  users.splice(users.indexOf(userData.username), 1);
  userCount = userData.userCount;
});

socket.on('chat message', function(message){
  postMessage(message, 'user-msg');
  updateScroll();
});

socket.on('admin', function(message){
  postMessage(message, 'admin');
});