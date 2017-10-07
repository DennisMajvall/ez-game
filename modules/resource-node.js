// 'Tree', 'Stone', 'Silver', 'Diamond'
const Sprite = require('./sprite');

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

    this.sprite = new Sprite();

    this.sprite.x = Math.random() * 0;
    this.sprite.y = Math.random() * 0;
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