const CollisionManager = require('./collision-manager');

const gamefieldHeight = 9800;
const gamefieldWidth = 9800;

module.exports = class Monster {
    constructor(type, monsterId){
    this.monsterId = monsterId;
    this.type = type; 
    Object.assign(this, global.json.monsters.default, global.json.monsters[type]);
    this.x = Math.round(Math.random() * gamefieldWidth + 100);
    this.y = Math.round(Math.random() * gamefieldHeight + 100);
    this.alive = true;
    CollisionManager.register('monster', this);
  }

  update(){
    this.updateMovement();
  }

  updateMovement(){
    if(this.alive){
      this.y -=1;
    
    }
  }
}

