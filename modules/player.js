const Sprite = require('./sprite');
const CollisionManager = require('./collision-manager');
const Bullet = require('./bullet');

module.exports = class Player {
  constructor(socket, name){
    this.name = name;
    this.sprite = new Sprite();
    this.x = Math.random()*10000;
    this.y = Math.random()*10000;
    this.socket = socket;
    this.hp = 150;
    this.dmg = 10;
    this.bullets = [];
    this.resources = { tree: 0, stone: 0, silver: 0, diamond: 0 };
    this.input = {};
    this.radius = 40;
    CollisionManager.registerPlayer(this);
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

  onCollision(other, distanceBetween){
    if (other.type == 'ResourceNode'){
      let combR = this.radius + other.radius;
      let distToMove = combR - distanceBetween;
      let dir = Math.atan2(other.y - this.y, other.x - this.x);

      let iLikeToMoveItMoveIt = {
        x: Math.cos(dir) * distToMove,
        y: Math.sin(dir) * distToMove
      };

      this.x -= iLikeToMoveItMoveIt.x;
      this.y -= iLikeToMoveItMoveIt.y;
    } else if (other.type == 'Bullet'){
      let bullet = other.target;
      this.hp -= bullet.dmg;
      console.log('Bullet HIT, dmg:', bullet.dmg, 'shooter:', bullet.owner.name, 'HP left:', this.hp);
    } else {
      console.log('player collided with', other);
    }
  }

  setRotation(rotationPos){
    this.sprite.rotation = rotationPos;
  }

  updateMovement(){
    const speed = 5;
    let vx = 0;
    let vy = 0;

    if (this.input.left){ vx -= speed; }
    if (this.input.right){ vx += speed; }
    if (this.input.up){ vy -= speed; }
    if (this.input.down){ vy += speed; }

    let calcX = (this.x + vx);
    let calcY = (this.y + vy);

    if(calcX < 10000 &&calcX > 0){
      this.x += vx;
    }

    if(calcY < 10000 && calcY > 0){
      this.y += vy;
    }
  }

  //TODO: Add cooldowns
  shoot(mousePos) {
    let bullet = new Bullet(mousePos.rot, this);
    this.bullets.push(bullet);
    return bullet;
  }

  //Update bullets > if bullet hits something remove it from array
  updateBullets(){
   for(let i= this.bullets.length -1; i>=0; i--){
     if(this.bullets[i].update() == false){
       this.bullets.splice(i, 1);
     }
    }
  }
}