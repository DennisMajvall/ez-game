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
    this.updateRotation();
    this.updateMovement();
    this.updateBullets();
  }

  // to do
  updateRotation(){
    // this.sprite.rotation = rotateToPoint(mouse.x, mouse.y, this.x, this.y);
  }

  spawnBullet(){
    let rotation = this.sprite.rotation;
    let bullet = {};

    const distanceFromCenter = 120;
    bullet.x = this.x + Math.cos(rotation) * distanceFromCenter;
    bullet.y = this.y + Math.sin(rotation) * distanceFromCenter;
    bullet.rotation = rotation;

    this.bullets.push(bullet);
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
  shoot() {
    this.spawnBullet();
  }
}