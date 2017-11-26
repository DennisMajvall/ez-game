class Game {
  constructor() {
    this.player = {};
    this.players = {};
    this.bullets = [];
    this.monsters = {};
    var canvas = document.getElementById("canvas-map");
    this.ctxMap = canvas.getContext("2d");
    this.ctxMap.fillStyle = "#D3D3D3";
    this.init();
  }

  init() {
    var background = new PIXI.Graphics();
    background.beginFill(0x768f5a); // NICE GREEN COLOR: rgb(118, 143, 90)
    background.drawRect(0, 0, 10000, 10000);
    background.endFill();
    stage.addChild(background);
  }

  initPostLoad() {
    this.maggots = new Maggots();
  }

  bindSocket(playerName) {
    if (this.socket) { return; } // don't attach listeners more than once
    this.socket = app.socket;

    this.socket.emit('playerStart', playerName);

    this.socket.on('playerSetup', (playerSetup) => {
      for (let p of playerSetup.players) {
        this.addPlayer(p.playerId, p.name);
      }

      this.player = this.players[playerSetup.player.playerId];
      this.player.id = playerSetup.player.playerId;
      keyboard.keyListener = this.player.onAction.bind(this.player);
      mouse.mouseListener = this.player.onAction.bind(this.player);
      this.startGame();
    });

    this.socket.on('newPlayer', (data) => {
      this.addPlayer(data.playerId, data.name);
    });

    this.socket.on('spawnResources', (resourceNodes) => {
      for (let resourceNode of resourceNodes) {
        var resource = new PixiSprite(resourceNode.type + '.png');
        resource.x = resourceNode.x;
        resource.y = resourceNode.y;
        stage.addChild(resource);
      }
    });

    this.socket.on('spawnMonsters', (monsters) => {
      for (let monster of monsters) {
        this.addMonster(monster.monsterId, monster.type, monster.health, monster.x, monster.y);
      }
    });

    this.socket.on('removePlayer', (playerId) => {
      if (!this.players[playerId]) { return; }
      stage.removeChild(this.players[playerId].nameText);
      stage.removeChild(this.players[playerId].sprite);
      stage.removeChild(this.players[playerId].healthBar);
    });

    this.socket.on('building', (data) => {
      var wall = new PixiSprite(data.type + '.png');
      wall.scale.set(0.25);
      wall.x = data.x;
      wall.y = data.y;
      wall.rotation = data.rotation;
      stage.addChild(wall);
    })


    this.socket.on('action', (data) => {
      this.players[data.playerId].onAction(data.action);
    })
  }

  //After binding socket and completing the setup start the game.
  startGame() {
    this.socket.on('playerPositions', (data) => {
      this.ctxMap.clearRect(0, 0, 100, 100);
      for (let key in data) {
        this.renderPlayer(key, data[key]);
      }
    });

    this.socket.on('bulletSpawn', this.addBullet.bind(this));
    this.socket.on('resources', this.setResources.bind(this));

    this.socket.on("updateHp", (data) => {
      this.players[data.id].hp = data.hp;
    });

    this.socket.on('moveMonster', (data) => {
      for (let key in data) {
        this.renderMonster(data[key]);
      }
    });

  }


  setResources(resources) {
    //Maybe needed later: this.player.resources = resources;
    for (let name in resources) {
      $(`#${name}`).text(resources[name]);
    }
  }

  update() {
    this.updateBullets();
    this.updateCameraMovement();
    this.player.rotation = mouse.rotation;
    this.maggots.update();
  }

  updateBullets() {
    for (let b of this.bullets) {
      b.x += b.vx;
      b.y += b.vy;
    }
  }


  updateCameraMovement() {
    stage.pivot.x = this.player.x;
    stage.pivot.y = this.player.y;
  }

  addBullet(data) {
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

  removeBullet(b, seconds) {
    setTimeout(() => {
      stage.removeChild(b);
      let bulletIndex = this.bullets.indexOf(b)
      if (bulletIndex != -1) {
        this.bullets.splice(bulletIndex, 1);
      }
    }, seconds * 1000);
  }

  addPlayer(playerId, playerName) {
    if (this.players[playerId] == undefined) {
      this.players[playerId] = new Player(playerId, playerName);
    }
  }

  renderPlayer(playerId, p) {
    this.players[playerId].x = p.x;
    this.players[playerId].y = p.y;
    if (playerId != this.player.id) {
      this.players[playerId].rotation = p.rotation;
      this.ctxMap.fillRect((p.x / 100) - 2, (p.y / 100) - 2, 4, 4);
    } else {
      this.ctxMap.fillStyle = "#FFFF00";
      this.ctxMap.fillRect((p.x / 100) - 2, (p.y / 100) - 2, 4, 4);
      this.ctxMap.fillStyle = "#D3D3D3";
    }
  }

  renderMonster(monster) {
    this.monsters[monster.monsterId].sprite.position.set(monster.x, monster.y);
  }

  addMonster(monsterId, type, health, x, y) {
    if (this.monsters[monsterId] == undefined) {
      this.monsters[monsterId] = new Monster(monsterId, type, health, x, y);
    }
  }

  removeMonster(monsterId) {
    if (!this.monsters[monsterId]) { return; }
    stage.removeChild(this.monsters[monsterId].sprite);
  }
}