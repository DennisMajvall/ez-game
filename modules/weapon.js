const CollisionManager = require('./collision-manager');
const Bullet = require('./bullet');

module.exports = class Weapon {
  constructor(player, type){
    Object.assign(this, global.json.weapons.default, global.json.weapons[type]);
    this.player = player;
    this.bullets = [];
    this.cooldownLeft = 0;
  }

  update(){
    this.updateBullets();
    this.updateShooting();
  }

  updateShooting(){
    if (this.player.input.shoot){
      const bul = this.shoot(this.player.rotation);
      if (bul){
        if(bul.weapon.projectileDuration){
          global.io.emit('bulletSpawn', { x: bul.x, y: bul.y, rotation: bul.rotation });
        } else{
          this.player.sendAction('click');
        }
      }
    }
    this.cooldownLeft -= global.deltaTime;
  }

  shoot(mouseRotation) {
    let bullet = null;
    if (this.cooldownLeft <= 0) {
      bullet = new Bullet(mouseRotation, this);
      this.bullets.push(bullet);
      this.cooldownLeft = this.cooldown;
    }
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