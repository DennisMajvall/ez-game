const Player = require('./player');
const ResourceNode = require('./resource-node');

module.exports = class Game {
  constructor(){
    this.players = {};
    this.resourceNodes = [];

    for(let i = 0; i < 5; i++){
      this.resourceNodes.push(new ResourceNode('tree'));
      this.resourceNodes.push(new ResourceNode('rock'));
    }
  }

  addPlayer(socketId){
    this.players[socketId] = new Player(socketId);
  }

  removePlayer(socketId){
    delete this.players[socketId];
  }

  getPlayerPositions(){
    let positions = {};

    for(let playerId in this.players){
      let p = this.players[playerId];

      positions[playerId] = {
        x: p.x,
        y: p.y,
	    rotation: p.sprite.rotation
      };
    }

    return positions;
  }

  hitPlayer(hitter, taker){
	  taker.hp -= hitter.dmg;

	  if(taker.hp <=0){
		  this.playerDied(hitter);
    }
  }

  playerDied(player){
    //dead animation;
  }

  update() {
    for(let playerId in this.players){
      this.players[playerId].update();
    }
  }
}
