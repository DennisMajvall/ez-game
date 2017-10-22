const CollisionManager = require('./collision-manager');
// 'Tree', 'Stone', 'Silver', 'Diamond'


module.exports = class Bullet {
  constructor(rotation, player){
    const distanceFromCenter = 120;
    this.x = player.x + Math.cos(rotation) * distanceFromCenter;
    this.y = player.y + Math.sin(rotation) * distanceFromCenter;
    this.rotation = rotation;
    this.owner = player;
    this.alive = true;

    this.dmg = 10;
    this.resourcesPerHit = 2;
    this.speed = 10;
    this.radius = 5;

    CollisionManager.registerBullet(this);
  }

  onCollision(somethingElse){
      this.alive = false;
      CollisionManager.removeBullet(this);
  }

  update(){
    this.x += Math.cos(this.rotation) * this.speed;
    this.y += Math.sin(this.rotation) * this.speed;
    return this.alive;
  }
}