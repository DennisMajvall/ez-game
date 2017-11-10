const Player = require('./player');
const ResourceNode = require('./resource-node');
const CollisionManager = require('./collision-manager');
const microtime = require('microtime')
const Monster = require('./monster');

global.deltaTime = 1/60;

module.exports = class Game {
  constructor(){
    this.players = {};
    this.resourceNodes = [];
    this.monsters = {};
    this.timeUpdated = microtime.now();

    for(let i = 0; i < 100; i++){
      this.resourceNodes.push( new ResourceNode('tree',  this.removeResourceNode.bind(this)) );
      this.resourceNodes.push( new ResourceNode('stone', this.removeResourceNode.bind(this)));
      let monsterId = guid();
      this.monsters[monsterId] = new Monster('cow', monsterId);
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

  getMonsters(){
    var shortMonsters = [];
    for(let monsterId in this.monsters){
      let m = this.monsters[monsterId];
      shortMonsters.push({monsterId: m.monsterId, type:m.type, health: m.health, x: m.x, y: m.y});
    }
    return shortMonsters;
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

  sendMonsterPositions(){
    let monsterPositions = {};
    for(let monsterId in this.monsters){
      let m = this.monsters[monsterId];
      monsterPositions[monsterId] = {
        monsterId: m.monsterId,
        x: m.x,
        y: m.y
      };
    } 
    global.io.emit('moveMonster', monsterPositions);
  }

  update() {
    for(let playerId in this.players){
      this.players[playerId].update();
    }

    for(let monsterId in this.monsters){
      this.monsters[monsterId].update();
    }
    CollisionManager.update();

    const now = microtime.now();
    global.deltaTime = (now - this.timeUpdated) / 1000000; // convert: microseconds
    this.timeUpdated = now;

    this.sendPlayerPositions();
    this.sendMonsterPositions();
  }
}




function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
