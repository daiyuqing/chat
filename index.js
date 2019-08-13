var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var user_id=0;
var user_list={};
app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});
app.get('/index', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', socket.nickname+': '+msg);
  });
  socket.on('set name', function(nickname){
    user_id++;
    user_list[user_id]={'user_id':user_id,'nickname':nickname};
  	socket.user_id=user_id;
  	socket.nickname=nickname;
    io.emit('user list',user_list);
    io.emit('user in-and-out',nickname+'进入了房间');
  });
  socket.on('disconnect', function(){
    delete user_list[socket.user_id];
    io.emit('user list',user_list);
    io.emit('user in-and-out',socket.nickname+'离开了房间');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});