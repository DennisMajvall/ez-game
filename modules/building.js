const CollisionManager = require('./collision-manager');

module.exports = class Building {
  constructor(player, type) {
    Object.assign(this, global.json.buildings.default, global.json.buildings[type]);
    this.player = player;
		this.type = type;
    this.rotation = player.rotation;
    this.x = player.x + Math.cos(this.rotation) * this.startingOffset;
    this.y = player.y + Math.sin(this.rotation) * this.startingOffset;
  }

  place() {
    this.player.buildings.push(this);
    CollisionManager.register('building', this);

		this.player.resources.tree -= this.tree;

		global.io.emit('building', {
			type: this.type,
			x: this.x,
			y: this.y,
			rotation: this.rotation,
			ownerId: this.player.socket.id
		});
  }

  onCollision(other) {
    if (this.health <= 0) { return true; }
    if (other.type == 'bullet') {
      let bullet = other.target;
      this.health -= bullet.weapon.dmg;
			if (this.health <= 0) {
				CollisionManager.remove('building', this);
			}
      console.log(bullet.weapon.player.name, 'dealt', bullet.weapon.dmg, 'dmg to', this.name, 'HP left:', this.health);
		}
  }

  update() {
    this.updateBuilding();
  }

  updateBuilding() {
    if (this.player.input.shoot) {
      this.build('wall');
    }
  }

  build(type) {
    let building = new Building(this.player, type);
    if (this.hasEnoughResources(building) && !CollisionManager.checkAgainstAllExcept(building, 'players')) {
      building.place();
			this.player.input.shoot = false;
    }
  }

  hasEnoughResources(building){
		return this.player.resources.tree >= building.tree
			&& this.player.resources.stone >= building.stone
			&& this.player.resources.silver >= building.silver
			&& this.player.resources.diamond >= building.diamond;
	}
}