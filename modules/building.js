const CollisionManager = require('./collision-manager');

module.exports = class Building {
  constructor(type){
    Object.assign(this, global.json.weapons.default, global.json.weapons[type]);
    this.owner;
    this.rotation;
    this.x;
    this.y;
    
    CollisionManager.register('building',this);
  }

  onCollision(){

  }
}