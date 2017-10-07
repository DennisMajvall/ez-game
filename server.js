const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const newGame = require('./public/js/game');



app.use(express.static('./public'));

io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  socket.on('disconnect', function(){
    console.log('a user disconnected', socket.id);
  });
});

http.listen(3000, function(){
  console.log('Server is now listening to port 3000');
});

function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 10000);



io.on('connection', function(socket){
  console.log('a user connected');
  newGame.addPlayer(new Player('player '+newGame.players.length));
});

function sendPlayerPositions(){
  let msg = {};
  for(let p of newGame.players) {
    msg[p.name] = { x: p.x, y: p.y };
  }

  // Example result
  // let msg = {
  //   "player 0": {x: 300, y: 350},
  //   "player 1": {x: 700, y: 240}
  // };

  io.emit('playerPositions', msg);
}

setInterval(()=>{
  sendPlayerPositions();
}, 100);