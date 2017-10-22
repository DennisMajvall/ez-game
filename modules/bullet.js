const CollisionManager = require('./collision-manager');

module.exports = class Bullet {
  constructor(rotation, weapon){
    this.rotation = rotation;
    this.weapon = weapon;

    this.x = weapon.player.x + Math.cos(rotation) * weapon.startingOffset;
    this.y = weapon.player.y + Math.sin(rotation) * weapon.startingOffset;
    this.radius = weapon.radius;
    this.alive = true;

    CollisionManager.registerBullet(this);
  }

  onCollision(somethingElse){
    this.alive = false;
    CollisionManager.removeBullet(this);
  }

  update(){
    this.x += Math.cos(this.rotation) * this.weapon.bulletSpeed;
    this.y += Math.sin(this.rotation) * this.weapon.bulletSpeed;
    return this.alive;
  }
}