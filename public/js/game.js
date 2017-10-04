class GameOfEz{
	constructor(){
	this.players = [];
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

var game = new GameOfEz();

var Hovsep = new Player('Hovsep');
var Dennis = new Player('Dennis');

game.addPlayer(Hovsep);
game.addPlayer(Dennis);


game.HitPlayer(Hovsep, Dennis);

