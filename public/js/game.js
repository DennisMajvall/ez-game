class Game{
  constructor(){
    this.players = [];
	
    for(let i = 0; i < 5; i++){
      new ResourceNode('tree');
    }
  
    for(let i = 0; i < 10; i++){
      new ResourceNode('rock');
    }
  }

addPlayer(player){
	this.players.push(player);
}

HitPlayer(hitter, taker){
	taker.hp -= hitter.dmg;
	this.LogHp();
	if(taker.hp <=0){
		this.PlayerDied(hitter);
	}
}

	PlayerDied(player){
		//dead animation;
	}

	
	
	LogHp() {
		
		for (let player of this.players){
		console.log("Name: "+player.name+" hp: "+ player.hp);
		}
	}
}

//var game = new Game();

//var Hovsep = new Player('Hovsep');
//var Dennis = new Player('Dennis');

//game.addPlayer(Hovsep);
//game.addPlayer(Dennis);


//game.HitPlayer(Hovsep, Dennis);

