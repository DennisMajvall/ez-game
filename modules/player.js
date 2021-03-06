const Sprite = require('./sprite');
const CollisionManager = require('./collision-manager');
const Weapon = require('./weapon');
const Building = require('./building');


module.exports = class Player {
  constructor(socket, name) {
    this.socket = socket;
    this.name = name;

    this.buildings = [];
    this.sprite = new Sprite();
    this.x = 500;
    this.y = 500;
    //this.x = Math.random()*10000;
    //this.y = Math.random()*10000;
    this.input = {};

    this.hp = 100;
    this.radius = 30;
    this.resources = { tree: 0, stone: 0, silver: 0, diamond: 0 };
    this.weapons = [
      new Weapon(this, 'axe'),
      new Weapon(this, 'shotgun'),
      new Building(this, 'wall')
    ];
    this.currentWeapon = this.weapons[0];

    CollisionManager.register('player', this);
  }

  set hp(value) { this._hp = value; }
  get hp() { return this._hp; }

  set rotation(value) { this.sprite.rotation = value; }
  get rotation() { return this.sprite.rotation; }

  set x(value) { this.sprite.x = value; }
  set y(value) { this.sprite.y = value; }
  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  update() {
    this.updateMovement();
    this.updateWeapons();
  }

  onCollision(other, distanceBetween, combinedRadius) {
    if (other.type == 'resourceNode' || other.type == 'building') {
      this.collideWithNonMovableObject(other, distanceBetween, combinedRadius);
    } else if (other.type == 'bullet') {
      let bullet = other.target;

      if (bullet.weapon.player.socket == this.socket) { return true; }
      if (this.hp <= 0) { return true; }

      this.hp -= bullet.weapon.dmg;
      global.io.emit('updateHp', { id: this.socket.id, hp: this.hp });
      console.log(bullet.weapon.player.name, 'dealt', bullet.weapon.dmg, 'dmg to', this.name, 'HP left:', this.hp);
    } else {
      console.log('player collided with', other);
    }
  }

  collideWithNonMovableObject(other, distanceBetween, combinedRadius) {
    let distToMove = distanceBetween - combinedRadius; // switched order
    let dir = Math.atan2(other.y - this.y, other.x - this.x);

    let distancesToMove = {
      x: Math.cos(dir) * distToMove,
      y: Math.sin(dir) * distToMove
    };

		this.changePosition(distancesToMove.x, distancesToMove.y); // double negative
  }


  updateMovement() {
    const speed = 5;
    let vx = 0;
    let vy = 0;

    if (this.input.left) { vx -= speed; }
    if (this.input.right) { vx += speed; }
    if (this.input.up) { vy -= speed; }
    if (this.input.down) { vy += speed; }

		this.changePosition(vx, vy);
  }

	changePosition(vx, vy){
    let calcX = (this.x + vx);
    let calcY = (this.y + vy);

    if (calcX < 10000 && calcX > 0) { this.x += vx; }
    if (calcY < 10000 && calcY > 0) { this.y += vy; }
	}

  updateWeapons() {
    let i = false;
    if (this.input.equip_1) { i = 0; this.sendAction('equip_1'); }
    else if (this.input.equip_2) { i = 1; this.sendAction('equip_2'); }
    else if (this.input.equip_3) { i = 2; this.sendAction('equip_3'); }
    // else if (this.input.equip_4) { i = 3; }
    // else if (this.input.equip_5) { i = 4; }

    if (i !== false && this.weapons[i]) {
      this.currentWeapon = this.weapons[i];
    }
    this.currentWeapon.update();
  }

  sendAction(playerInput) {
    global.io.emit('action', { playerId: this.socket.id, action: playerInput });
  }
}