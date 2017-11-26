const CollisionManager = require('./collision-manager');

module.exports = class Building {
  constructor(player, type) {
    Object.assign(this, global.json.buildings.default, global.json.buildings[type]);
    this.player = player;
    this.rotation = player.rotation;
    this.x = player.x + Math.cos(this.rotation) * this.startingOffset;
    this.y = player.y + Math.sin(this.rotation) * this.startingOffset;
  }

  place() {
    CollisionManager.register('building', this);
  }

  onCollision() {
  }

  update() {
    this.updateBuilding();
  }

  updateBuilding() {
    if (this.player.input.shoot) {
      this.build('kebab');
    }
  }

  build(type) {
    let building = new Building(this.player, 'wall');
    if (this.player.resources.tree >= building.wood) {
      //more validation but Dennis says fck it. fck collision because dennis says it.
      this.player.buildings.push(building);
      building.place();

      this.player.resources.tree -= building.wood;
      this.player.input.shoot = false;
      global.io.emit('building', { type: 'wall', x: building.x, y: building.y, rotation: building.rotation, ownerId: this.player.socket.id });
    }
  }
}