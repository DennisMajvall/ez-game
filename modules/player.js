const Sprite = require('./sprite');
const CollisionManager = require('./collision-manager');
const Weapon = require('./weapon');

module.exports = class Player {
  constructor(socket, name){
    this.socket = socket;
    this.name = name;

    this.sprite = new Sprite();
    this.x = Math.random()*10000;
    this.y = Math.random()*10000;
    this.input = {};

    this.hp = 150;
    this.radius = 40;
    this.resources = { tree: 0, stone: 0, silver: 0, diamond: 0 };
    this.weapons = [
      new Weapon(this, 'axe'),
      new Weapon(this, 'shotgun')
    ];
    // Change the index below to switch starting weapon
    // TODO: use hotkeys and onclick-buttons.
    this.currentWeapon = this.weapons[1];

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
    this.currentWeapon.update();
  }

  shoot(mousePos) {
    return this.currentWeapon.shoot(mousePos.rot);
  }

  setRotation(rotationPos){
    this.sprite.rotation = rotationPos;
  }

  onCollision(other, distanceBetween, combinedRadius){
    if (other.type == 'ResourceNode'){
      this.collideWithResourceNode(other, distanceBetween, combinedRadius);
    } else if (other.type == 'Bullet'){
      let bullet = other.target;
      if (bullet.weapon.player == this) {
        return true;
      }
      this.hp -= bullet.weapon.dmg;
      console.log(bullet.weapon.player.name, 'dealt', bullet.weapon.dmg, 'dmg to', this.name, 'HP left:', this.hp);
    } else {
      console.log('player collided with', other);
    }
  }

  collideWithResourceNode(other, distanceBetween, combinedRadius){
    let distToMove = combinedRadius - distanceBetween;
    let dir = Math.atan2(other.y - this.y, other.x - this.x);

    let distancesToMove = {
      x: Math.cos(dir) * distToMove,
      y: Math.sin(dir) * distToMove
    };

    this.x -= distancesToMove.x;
    this.y -= distancesToMove.y;
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
}