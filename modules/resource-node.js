const CollisionManager = require('./collision-manager');
// 'tree', 'stone', 'silver', 'diamond'
const gamefieldHeight = 9800;
const gamefieldWidth = 9800;

module.exports = class ResourceNode {
  constructor(type, removeFunction){
    this.type = type;
    this.removeFunction = removeFunction;
    this.x = Math.random() * gamefieldWidth + 100;
    this.y = Math.random() * gamefieldHeight + 100;

    if (type == 'diamond') {
      this.amount = 200;
    }

    this.radius = 45;
    if (type == 'tree') {
      this.radius = 100;
    }

    CollisionManager.registerResourceNode(this);
  }

  onCollision(somethingElse){
    if (somethingElse.type == 'Bullet'){
      let bullet = somethingElse.target;
      this.onAttacked(bullet.weapon.player, bullet.weapon.resourcesPerHit);
    }
  }

  onAttacked(player, numResources){
    if (this.amount != undefined) {
      numResources = Math.min(this.amount, numResources);
      this.amount -= numResources;
    }

    player.resources[this.type] += numResources;
    if (numResources) {
      player.socket.emit('resources', player.resources);
    }

    if (this.amount != undefined && this.amount <= 0) {
      CollisionManager.removeResourceNode(this);
      this.removeFunction(this);
    }
  }
}