class Player{
  constructor(playerId, playerName) {
    this.id = playerId;
    const playerRadius = 30;
    const weaponScale = 0.25;

    // Make the player-circle
    this.sprite = new PIXI.Graphics();
    this.sprite.lineStyle(4, 0x35354d);
    this.sprite.beginFill(0x7c5d4f);
    this.sprite.drawCircle(0, 0, playerRadius);

    // Add weapon as a child to player
    this.weapon = new PixiSprite('axe.png');
    this.weapon.anchor.set(0, 0.5);
    this.weapon.scale.x = this.weapon.scale.y = weaponScale;
    this.sprite.addChild(this.weapon);

    // Add name (not as a child) to player
    this.nameText = new PIXI.Text(playerName);
    this.nameText.anchor.set(0.5, 0.5);

    stage.addChild(this.sprite);
    stage.addChild(this.nameText);
  }

  onKeyUp(action){
    let eq = false;
    if (action == 'equip_1') { eq = 'axe'; }
    else if (action == 'equip_2') { eq = 'shotgun'; }

    if (eq) {
      this.weapon.texture = PIXI.loader.resources['/images/'+eq+'.png'].texture;
    }
  }

  set hp(value){ this._hp = value; }
  get hp(){ return this._hp; }

  set x(value){
    this.sprite.x = value;
    this.nameText.x = value;
  }
  set y(value){
    this.sprite.y = value;
    this.nameText.y = value - 115;
  }

  get x(){ return this.sprite.x; }
  get y(){ return this.sprite.y; }

  set rotation(value){ this.sprite.rotation = value; }
  get rotation(){ return this.sprite.rotation; }

}