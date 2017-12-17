class Monster {
  constructor(monsterId, type, health, x, y) {
    this.monsterId = monsterId;
    this.health = health;


    this.sprite = new PixiSprite(type + '.png');
    this.sprite.position.set(x, y);
    // console.log(monsterId.substr(0,8) + '...', type, health + 'hp', x + 'x', y + 'y');

    stage.addChild(this.sprite);
  }
}