const Sprite = require('./sprite');
const CollisionManager = require('./collision-manager');


module.exports = class Player {
  constructor(id, name){
    this.name = name;
    this.sprite = new Sprite();
    this.x = Math.random()*10000;
    this.y = Math.random()*10000;
    this.id = id;
    this.hp = 150;
    this.dmg = 10;
    this.bullets = [];
    this.numTrees = 0;
    this.resourcesPerAttack = 2;
    this.input = {};
    this.radius = 90;
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

  onCollision(other, distanceCollided){
    if (other.type == 'ResourceNode'){
      let combR = this.radius + other.radius;
      let distToMove = combR - distanceCollided;
      console.log('distanceCollided', distanceCollided, 'combR', combR);
      let dir = Math.atan2(other.y - this.y, other.x - this.x);

      let iLikeToMoveItMoveIt = {
        x: Math.cos(dir) * distToMove,
        y: Math.sin(dir) * distToMove
      };

      this.x -= iLikeToMoveItMoveIt.x;
      this.y -= iLikeToMoveItMoveIt.y;
      console.log('lol', distToMove);
    } else {
      console.log('player collided with', );
    }
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