const CollisionManager = require('./collision-manager');
// 'Tree', 'Stone', 'Silver', 'Diamond'
const gamefieldHeight = 9800;
const gamefieldWidth = 9800;

module.exports = class ResourceNode {
  constructor(type){
    // hp? nope
    // sprite? yes
    // can be attacaked = we have to check if the player bullet collides with `this`
    // when attacked, add resources to the user who owned the bullet that hit `this`

    this.type = type;

    if (type == 'Diamond') {
      this.amount = 200;
    }

    this.x = Math.random() * gamefieldWidth + 100;
    this.y = Math.random() * gamefieldHeight + 100;
    this.radius = 50;
    if (type == 'tree') { this.radius = 100; }
    CollisionManager.registerResourceNode(this);
  }


  onCollision(somethingElse){
    console.log('resource', this.type, 'collided with', somethingElse);
  }

  onAttacked(){
    if (this.amount != undefined) {
      this.amount -= 5;
      if (this.amount <= 0) {
        // destroy it
        return;
      }
    }

    // unlimited <3 <3 <3
  }
}