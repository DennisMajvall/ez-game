const Sprite = require('./sprite');

module.exports = class Player {
  constructor(id){
    this.sprite = new Sprite();
    this.x = 0;
    this.y = 0;
    this.id = id;
    this.hp = 150;
    this.dmg = 10;
    this.bullets = [];
    this.numTrees = 0;
    this.resourcesPerAttack = 2;
    this.input = {};
  }

  set hp(value){ this._hp = value; }
  get hp(){ return this._hp; }

  set x(value){ this.sprite.x = value; }
  set y(value){ this.sprite.y = value; }
  get x(){ return this.sprite.x; }
  get y(){ return this.sprite.y; }

  update(){
    this.updateMovement();
    this.updateBullets();
  }


  setRotation(rotationPos){
    this.sprite.rotation = rotationPos;
  }

  spawnBullet(mouse){
    let rotation = mouse.rot;
    let bullet = {};

    const distanceFromCenter = 120;
    bullet.x = this.x + Math.cos(rotation) * distanceFromCenter;
    bullet.y = this.y + Math.sin(rotation) * distanceFromCenter;
    bullet.rotation = rotation;

    this.bullets.push(bullet);
	  return bullet;
  }

  updateBullets(){
    const speed = 10;

    for(let b of this.bullets){
      b.x += Math.cos(b.rotation) * speed;
      b.y += Math.sin(b.rotation) * speed;
    }
  }

  updateMovement(){
    const speed = 5;
    let vx = 0;
    let vy = 0;

    if (this.input.left){ vx -= speed; }
    if (this.input.right){ vx += speed; }
    if (this.input.up){ vy -= speed; }
    if (this.input.down){ vy += speed; }

    this.x += vx;
    this.y += vy;
  }

  //TODO: Add cooldowns
  shoot(mousePos) {
    return this.spawnBullet(mousePos);
  }

  // // Global helper functions
  rotateToPoint(mx, my, px, py){
	  var dist_Y = my - py;
	  var dist_X = mx - px;
	  var angle = Math.atan2(dist_Y,dist_X);
	  return angle;
  }
// function radiansToDegrees(angle){ return angle * 180 / Math.PI; }
}