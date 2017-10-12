class Game {
  constructor() {
    this.player = {};
    this.players = {};
    this.bullets = [];
    this.init();
  }

  init() {
    var background = new PIXI.Graphics();
    background.beginFill(0x768f5a); // NICE GREEN COLOR: rgb(118, 143, 90)
    background.drawRect(0,0,10000,10000);
    background.endFill();
    stage.addChild(background);
  }

  initPostLoad(){
    this.maggots = new Maggots();
  }

  bindSocket(playerName){
    if (this.socket) { return; } // don't attach listeners more than once
    this.socket = app.socket;
    this.socket.emit('playerStart', playerName);
	  this.socket.on('playerSetup', (playerSetup)=>{
      for(let p of playerSetup.players){
        this.addPlayer(p.playerId, p.name);
      }
    
      this.player = this.players[playerSetup.player.playerId];
      this.player.id = playerSetup.player.playerId;
      this.startGame();
    });
    
    this.socket.on('newPlayer',(data)=>{
      console.log('new player'+ data.name)
      this.addPlayer(data.playerId, data.name);
    });



    this.socket.on('spawnResources', (resourceNodes)=>{
      for(let resourceNode of resourceNodes){
        var resource = new PixiSprite(resourceNode.type+'.png');
        resource.x = resourceNode.x;
        resource.y = resourceNode.y;
        stage.addChild(resource);
      }
    });


    this.socket.on('removePlayer', (data)=>{
      stage.removeChild(this.players[data].nameText);
      stage.removeChild(this.players[data]);
    });
  }

  //After binding socket and completing the setup start the game.
  startGame(){
    this.socket.on('playerPositions', (data)=>{
      for (let key in data){
        this.renderPlayer(key, data[key]);
      }
    });

    this.socket.on('bulletSpawn', this.addBullet.bind(this));
  }

  update(){
    this.updateBullets();
    this.updateCameraMovement();
    this.player.rotation = mouse.rotation;
    this.maggots.update();
  }

  updateBullets(){
    for(let b of this.bullets){
      b.x += b.vx;
      b.y += b.vy;
    }
  }

  updateCameraMovement(){
    stage.pivot.x = this.player.x;
    stage.pivot.y = this.player.y;
  }

  addBullet(data){
    const speed = 10;

    var bullet = new PixiSprite('bullet.png');
    bullet.x = data.x;
    bullet.y = data.y;
    bullet.rotation = data.rotation;

    bullet.vx = Math.cos(bullet.rotation) * speed;
    bullet.vy = Math.sin(bullet.rotation) * speed;
    this.bullets.push(bullet);
	
    stage.addChild(bullet);

    // Removes it after n seconds
    this.removeBullet(bullet, 10);
  }

  removeBullet(b, seconds){
    setTimeout(()=>{
      stage.removeChild(b);
      let bulletIndex = this.bullets.indexOf(b)
      if (bulletIndex != -1) {
        this.bullets.splice(bulletIndex, 1);
      }
    }, seconds * 1000);
  }

  addPlayer(playerId, playerName){
	if(this.players[playerId] == undefined) {      
	  this.players[playerId] = new PixiSprite('player.png');
      this.players[playerId].nameText = new PIXI.Text(playerName);
      this.players[playerId].nameText.anchor.set(0.5, 0.5);

      stage.addChild(this.players[playerId].nameText);
      stage.addChild(this.players[playerId]);
	}
  }

  renderPlayer(playerId, p){
    //if (this.players[playerId] == undefined) {
    //    this.addPlayer(playerId);
    //}
    this.players[playerId].x = p.x;
    this.players[playerId].y = p.y;

    this.players[playerId].nameText.x = this.players[playerId].x;
    this.players[playerId].nameText.y = (this.players[playerId].y-150);

    if (playerId != this.player.id) {
      this.players[playerId].rotation = p.rotation;
    }
  }
}