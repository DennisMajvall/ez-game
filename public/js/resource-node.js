// 'Tree', 'Stone', 'Silver', 'Diamond'

class ResourceNode {
  constructor(type){
    // hp? nope
    // sprite? yes
    // can be attacaked = we have to check if the player bullet collides with `this`
    // when attacked, add resources to the user who owned the bullet that hit `this`

    this.type = type;

    if (type == 'Diamond') {
      this.amount = 200;
    }

    this.sprite = new PixiSprite(type+".png");
    stage.addChild(this.sprite);

    this.sprite.x = Math.random() * w_width;
    this.sprite.y = Math.random() * w_height;
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