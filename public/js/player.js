class Player{
  constructor(playerId, playerName) {
    this.id = playerId;
    this._hp = 100;
    this.AnimateTimer = null;
    const playerRadius = 30;
    const weaponScale = 0.25;

    // Make the player-circle
    this.sprite = new PIXI.Graphics();
    this.sprite.lineStyle(4, 0x35354d);
    this.sprite.beginFill(0x7c5d4f);
    this.sprite.drawCircle(0, 0, playerRadius);


    let handRight = new PIXI.Graphics();
    handRight.lineStyle(4, 0x35354d);
    handRight.beginFill(0x7c5d4f);
    handRight.position.set(30 , 15);
    handRight.drawCircle(0, 0, playerRadius/4);

    let handLeft = new PIXI.Graphics();
    handLeft.lineStyle(4, 0x35354d);
    handLeft.beginFill(0x7c5d4f);
    handLeft.position.set(30 , -15);
    handLeft.drawCircle(0, 0, playerRadius/4);

    this.sprite.addChild(handRight);
    this.sprite.addChild(handLeft);

    // Add weapon as a child to player
    this.weapon = new PixiSprite('axe.png');
    this.weapon.anchor.set(0, 0.5);
    this.weapon.scale.x = this.weapon.scale.y = weaponScale;
    this.weapon.pivot = new PIXI.Point(-30, -80); 
    this.sprite.addChild(this.weapon);

    // Add name (not as a child) to player
    this.nameText = new PIXI.Text(playerName);
    this.nameText.anchor.set(0.5, 0.5);


    this.healthBar = new PIXI.Container();
    this.sprite.addChild(this.healthBar);

    let blackBackground = new PIXI.Graphics();
    blackBackground.beginFill(0x000000);
    blackBackground.drawRect(-50, 0, 100, 8);
    blackBackground.endFill();
    this.healthBar.addChild(blackBackground);

    let redHpBar = new PIXI.Graphics();
    redHpBar.beginFill(0xFF3300);
    redHpBar.drawRect(-50, 0, 100, 8);
    redHpBar.endFill();
    this.healthBar.addChild(redHpBar);

    this.healthBar.outer = redHpBar;



    stage.addChild(this.healthBar);
    stage.addChild(this.sprite);
    stage.addChild(this.nameText);
  }

  onAction(action){
    let eq = false;                                                     
    if (action == 'equip_1') { eq = 'axe'; 
    this.weapon.pivot = new PIXI.Point(-30, -80); 
    }
    else if (action == 'equip_2') { 
      eq = 'shotgun'; 
      this.weapon.pivot = new PIXI.Point(0, 0); 
    }
    else if (action == 'equip_3'){
      eq = 'wall';
      this.weapon.pivot = new PIXI.Point(0, 0);
    }
    else if(action == 'click'){ 
      //set attack animation to 0 > if its between 0 & 1 then play animation else 
     //If animation is playing don't start new animation.
     if(this.weapon.texture ==  PIXI.loader.resources['/images/axe.png'].texture){
        if(this.AnimateTimer == null){
          this.AnimateTimer =  setInterval(this.AnimateWeapon.bind(this), 16);
        }
      }
    }
    if (eq) {
      this.weapon.texture = PIXI.loader.resources['/images/'+eq+'.png'].texture;
    }
  }

  AnimateWeapon(){
      if(this.weapon.rotation > -0.7){
        this.weapon.rotation -= 0.1;
      }else{
          clearInterval(this.AnimateTimer);
          this.AnimateTimerBack = setInterval(this.AnimateWeaponBack.bind(this), 16);
      }
  }

  AnimateWeaponBack(){
    this.weapon.rotation += 0.1;
    if(this.weapon.rotation >= 0){
      this.weapon.rotation = 0;
      this.AnimateTimer = null;
      clearInterval(this.AnimateTimerBack);
    }
  }


  set hp(value){ 
    this.healthBar.outer.width= value;
    this.healthBar.outer.x -= (this._hp-value)/2;
    this._hp = value;
  }
  get hp(){ return this._hp; }

  set x(value){
    this.sprite.x = value;
    this.nameText.x = value;
    this.healthBar.x = value;
  }
  set y(value){
    this.sprite.y = value;
    this.nameText.y = value - 115;
    this.healthBar.y = value - 100;
  }

  get x(){ return this.sprite.x; }
  get y(){ return this.sprite.y; }

  set rotation(value){ this.sprite.rotation = value; }
  get rotation(){ return this.sprite.rotation; }

}