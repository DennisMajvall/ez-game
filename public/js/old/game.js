const Player = require('./player');
const ResourceNode = require('./resource-node');

module.exports = class Game {
  constructor(){
    this.players = [];

    for(let i = 0; i < 5; i++){
      new ResourceNode('tree');
    }

    for(let i = 0; i < 10; i++){
      new ResourceNode('rock');
    }

	  this.addPlayer(new Player('Henk'));
  }

  addPlayer(player){
    this.players.push(player);
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
    for(let p of this.players){
        p.update();
    }
  }
}
