class Player {
	constructor(name){
		this.name = name;
		this.hp = 150;
    this.dmg = 10;
    this.sprite = {};
    this.bullets = [];
    this.numTrees = 0;
    this.resourcesPerAttack = 2;
  }

  initialize(){
    this.sprite = new PixiSprite("player.png");
    stage.addChild(this.sprite);

    this.x = w_width/2;
    this.y = w_height/2;


    new MovementInput(this.sprite);

    stage.on("mousedown", this.shoot.bind(this));
  }

  set x(value){ this.sprite.x = value; }
  set y(value){ this.sprite.y = value; }
  get x(){ return this.sprite.x; }
  get y(){ return this.sprite.y; }

  update(){
    this.updateRotation();
    this.updateMovement();
    this.updateBullets();
	this.updateStats();
  }
  
  
  updateStats(){
	//var richText = new PIXI.Text('Name: '+this.name +' '+'HP: '+this.hp , styleBlue);
	var richText = new PIXI.Text('Name: '+this.name +' '+'\nHP: '+this.hp);
    richText.x = 30;
    richText.y = 50;
    stage.addChild(richText);
  }

  updateRotation(){
    this.sprite.rotation = rotateToPoint(mouse.x, mouse.y, this.x, this.y);
    // console.log('lol', this.sprite.rotation);
    // this.updateRotation = function() {};
  }

  spawnBullet(){
    let rotation = this.sprite.rotation;
    let bullet = new PIXI.Sprite(PIXI.loader.resources["/images/bullet.png"].texture);

    const distanceFromCenter = 120;
    bullet.x = this.x + Math.cos(rotation) * distanceFromCenter;
    bullet.y = this.y + Math.sin(rotation) * distanceFromCenter;
    bullet.rotation = rotation;

    stage.addChild(bullet);
    this.bullets.push(bullet);
  }

  updateBullets(){
    const speed = 10;

    for(let b of this.bullets){
      b.x += Math.cos(b.rotation) * speed;
      b.y += Math.sin(b.rotation) * speed;
    }

    // loop backwards (this way you can delete bullets from inside the array, while looping through it)
    // for(var b=bullets.length-1; b>=0; b--){
    //   bullets[b].x += Math.cos(bullets[b].rotation) * speed;
    //   bullets[b].y += Math.sin(bullets[b].rotation) * speed;
    // }
  }

  updateMovement(){
    this.x += this.sprite.vx;
    this.y += this.sprite.vy;
  }


  //TODO: Add cooldowns
  shoot(e) {
    this.spawnBullet();
  }
}