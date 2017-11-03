const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

global.io = io;

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


// Above this line is the server-code (has nothing to do with the game)

global.json = {};
global.json.weapons = require('./public/json/weapons.json');
global.json.buildings = require('./public/json/buildings.json');
const Game = require('./modules/game');
const game = new Game();



function onPlayerConnected(socket){
  console.log('a user connected', socket.id);
  socket.on('playerStart',(playerName)=>{
    game.addPlayer(socket, playerName)
    joinGame(socket);
  });
 }

function onPlayerDisconnected(socket){
  console.log('a user disconnected', socket.id);
  game.removePlayer(socket.id);
  io.emit('removePlayer',socket.id);
}

function joinGame(socket){
  socket.broadcast.emit('newPlayer', {playerId:socket.id, name: game.players[socket.id].name});
  socket.emit('playerSetup', {player:{playerId:socket.id, name: game.players[socket.id].name}, players:game.getPlayers()});

  socket.emit('spawnResources', game.resourceNodes);


  // TODO Maybe add resources on server and clientside. only send resource ammount @start of the game and then update it clientside and on server let the collisions automatically update it.

  socket.on('keyboardDown', function(action){
    game.players[socket.id].input[action] = true;
  });

  socket.on('keyboardUp', function(action){
    game.players[socket.id].input[action] = false;
  });

  socket.on('mouseDown', function(mouseData){
    game.players[socket.id].input['shoot'] = true;
  });

  socket.on('mouseUp', function(mouseData){
    game.players[socket.id].input['shoot'] = false;
  });

  socket.on('rotation', function(data){
	  game.players[socket.id].rotation = data;
  });
}

setInterval(()=>{
  game.update();
}, 16);