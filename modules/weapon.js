const CollisionManager = require('./collision-manager');
const Bullet = require('./bullet');

module.exports = class Weapon {
  constructor(player, type){
    Object.assign(this, global.json.weapons.default, global.json.weapons[type]);
    this.player = player;
    this.bullets = [];
  }

  update(){
    this.updateBullets();
  }

  //TODO: Add cooldowns
  shoot(mouseRotation) {
    let bullet = new Bullet(mouseRotation, this);
    this.bullets.push(bullet);
    return bullet;
  }

  // If bullet hits something or time runs out - remove it from the array
  updateBullets(){
   for(let i= this.bullets.length -1; i>=0; i--){
      if(this.bullets[i].update() == false){
        this.bullets.splice(i, 1);
      }
    }
  }
}