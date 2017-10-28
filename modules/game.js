const Player = require('./player');
const ResourceNode = require('./resource-node');
const CollisionManager = require('./collision-manager');
const microtime = require('microtime')

global.deltaTime = 1/60;

module.exports = class Game {
  constructor(){
    this.players = {};
    this.resourceNodes = [];
    this.timeUpdated = microtime.now();

    for(let i = 0; i < 100; i++){
      this.resourceNodes.push( new ResourceNode('tree',  this.removeResourceNode.bind(this)) );
      this.resourceNodes.push( new ResourceNode('stone', this.removeResourceNode.bind(this)) );
    }
  }

  addPlayer(socket, playerName = 'Unknown'){
    this.players[socket.id] = new Player(socket, playerName);
  }

  removePlayer(socketId){
    delete this.players[socketId];
  }

  removeResourceNode(r){
    let i = this.resourceNodes.indexOf(r);
    if (i != -1) {
      this.resourceNodes.splice(i, 1);
    }
  }

  getPlayers(){
    var shortPlayers = [];
    for(let playerId in this.players){
	    let p = this.players[playerId];
      shortPlayers.push({playerId: p.socket.id  , name:p.name});
    }
    return shortPlayers;
  }

  sendPlayerPositions(){
    let positions = {};

    for(let playerId in this.players){
      let p = this.players[playerId];
      positions[playerId] = {
        name: p.name,
        x: p.x,
        y: p.y,
        rotation: p.sprite.rotation
      };
    }

    global.io.emit('playerPositions', positions);
  }

  update() {
    for(let playerId in this.players){
      this.players[playerId].update();
    }

    CollisionManager.update();

    const now = microtime.now();
    global.deltaTime = (now - this.timeUpdated) / 1000000; // convert: microseconds
    this.timeUpdated = now;

    this.sendPlayerPositions();
  }
}
