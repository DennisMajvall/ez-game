const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('./public'));

http.listen(3000, function(){
  console.log('Server is now listening to port 3000');
});

io.on('connection', function(socket){
  onPlayerConnected(socket);
  socket.on('disconnect', function(){
    onPlayerDisconnected(socket);
  });
});


// Above this fucking line is the server-code (has nothing to do with ze game)

const Game = require('./modules/game');

const game = new Game();


function onPlayerConnected(socket){
  console.log('a user connected', socket.id);
  game.addPlayer(socket.id);
  sendPlayerPositions();

  socket.on('keyboardDown', function(action){
    game.players[socket.id].input[action] = true;
  });
  socket.on('keyboardUp', function(action){
    game.players[socket.id].input[action] = false;
  });

  socket.on('rotation', function(data){
	  game.players[socket.id].setRotation(data);
	  
	  
    console.log(socket.id, 'rotation:', data);
  });

  socket.on('mouseDown', function(data){
	var bul = game.players[socket.id].shoot(data);  
	if(bul){
	  io.emit('bulletSpawn', {x:bul.x, y:bul.y, rotation:bul.rotation} );
	}
	console.log(socket.id, 'mouse-click:', data);
  });
}

function onPlayerDisconnected(socket){
  console.log('a user disconnected', socket.id);
  game.removePlayer(socket.id);
}


function sendPlayerPositions(){
  let msg = game.getPlayerPositions();

  io.emit('playerPositions', msg);
}


setInterval(()=>{
  game.update();
  sendPlayerPositions();
}, 16);