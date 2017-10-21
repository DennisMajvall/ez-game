const CollisionManager = require('./collision-manager');
// 'Tree', 'Stone', 'Silver', 'Diamond'


module.exports = class Bullet {
  constructor(mouse, player){
    let rotation = mouse.rot;
    this.speed = 10;

    const distanceFromCenter = 120;
    this.x = player.x + Math.cos(rotation) * distanceFromCenter;
    this.y = player.y + Math.sin(rotation) * distanceFromCenter;
    this.rotation = rotation;
    this.dmg = 10;
    this.owner = player;
    this.radius = 5;
    this.alive = true;
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