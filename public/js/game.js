class Game{
  constructor(){
    this.players = [];
	
    for(let i = 0; i < 5; i++){
      new ResourceNode('tree');
    }
  
    for(let i = 0; i < 10; i++){
      new ResourceNode('rock');
    }
	
	this.addPlayer(new Player('Henk'));
  }

  addPlayer(player){
	  //Send to client to render player in game
    //io.emit('addPlayer', { player{
    //  "p1Pos": {x: 300, y: 350},
   //   "p2Pos": {x: 700, y: 240}
   // }});  
    this.players.push(player);
  }

  HitPlayer(hitter, taker){
	taker.hp -= hitter.dmg;
	
	if(taker.hp <=0){
		this.PlayerDied(hitter);
    }
  }

  PlayerDied(player){
    //dead animation;
  }

	

	
  update() {
	for(let p of this.players){
      p.update();
	}
  }
}

//var game = new Game();

//var Hovsep = new Player('Hovsep');
//var Dennis = new Player('Dennis');

//game.addPlayer(Hovsep);
//game.addPlayer(Dennis);


//game.HitPlayer(Hovsep, Dennis);

