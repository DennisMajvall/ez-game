const CollisionManager = require('./collision-manager');

const gamefieldHeight = 9800;
const gamefieldWidth = 9800;

module.exports = class Monster {
  constructor(type, monsterId) {
    this.monsterId = monsterId;
    this.type = type;
    this.counter = 0;
    this.lastDirection = 90;
    Object.assign(this, global.json.monsters.default, global.json.monsters[type]);
    this.x = Math.round(Math.random() * gamefieldWidth + 100);
    this.y = Math.round(Math.random() * gamefieldHeight + 100);
    this.alive = true;
    CollisionManager.register('monster', this);
  }

  update() {
    this.updateMovement();
  }

  updateMovement() {
    if (this.alive) {
      if (this.type == 'cow') {
        if (this.lastDirection == 90) {
          this.y -= 1;
          this.counter++;
          if (this.counter >= 100) {
            this.lastDirection = 180;
            this.counter = 0;
          }
        } else if (this.lastDirection == 180) {
          this.y += 1;
          this.counter++;
          if (this.counter >= 100) {
            this.lastDirection = 90;
            this.counter = 0;
          }
        }
      }
    }
  }
}

