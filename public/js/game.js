class Game {
  constructor() {
    this.player = {};
    this.players = {};
    this.bullets = [];
    var canvas = document.getElementById("CanvasMap");
    this.ctxMap = canvas.getContext("2d");
    this.ctxMap.fillStyle="#D3D3D3";
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
      keyboard.keyListener = this.player.onAction.bind(this.player);
      mouse.mouseListener = this.player.onAction.bind(this.player);
      this.startGame();
    });

    this.socket.on('newPlayer',(data)=>{
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
      if (!this.players[data]) { return; }
      stage.removeChild(this.players[data].nameText);
      stage.removeChild(this.players[data].sprite);
      stage.removeChild(this.players[data].healthBar);
    });
  }

  //After binding socket and completing the setup start the game.
  startGame(){
    this.socket.on('playerPositions', (data)=>{
      this.ctxMap.clearRect(0,0,100,100);
      for (let key in data){
        this.renderPlayer(key, data[key]);
      }
    });

    this.socket.on('bulletSpawn', this.addBullet.bind(this));
    this.socket.on('resources', this.setResources.bind(this));

    this.socket.on("updateHp",(data) =>{
      //if(this.player.id == data.id){
      //    this.player.set = data.hp;
      //    console.log(this.player.name, this.players.hp);
      //}else{
        this.players[data.id].hp = data.hp;
        console.log(this.players[data.id].name, data.hp);
      //}
    });
  }


  setResources(resources){
    //Maybe needed later
    //this.player.resources = resources;

    for (let name in resources) {
      $(`#${name}`).text(resources[name]);
    }
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
      this.players[playerId] = new Player(playerId, playerName);
    }
  }

  renderPlayer(playerId, p){
    this.players[playerId].x = p.x;
    this.players[playerId].y = p.y;
    if (playerId != this.player.id) {
      this.players[playerId].rotation = p.rotation;
      this.ctxMap.fillRect((p.x/100),(p.y/100),4,4);
    }else{
      this.ctxMap.fillStyle ="#FFFF00";
      this.ctxMap.fillRect((p.x/100),(p.y/100),4,4);
      this.ctxMap.fillStyle ="#D3D3D3";
    }
  }
}