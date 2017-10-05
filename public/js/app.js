//Create the renderer

var player, state, stage, renderer;

var w_width = window.innerWidth;
var w_height = window.innerHeight;

var bullets = [];  
var bulletSpeed = 5;

renderer = PIXI.autoDetectRenderer(w_width, w_height, {
  antialias: false,
  transparent: false,
  resolution: 1
});


var background = new PIXI.Graphics();  
background.beginFill(0x123456);  
background.drawRect(0,0,w_width,w_height);  
background.endFill();  


// renderer.autoResize = true;
//document.getElementById('display').appendChild(renderer.view);
document.body.appendChild(renderer.view);

stage = new PIXI.Container();
stage.interactive = true;
stage.mousemove = movehandler;

var x = 0;
var y = 0;

var bulletImg = PIXI.Texture.fromImage('images/BulletSmall.png');

PIXI.loader
  .add("/images/player.png") // 128x128
  .load(setup);

  
  
function setup() {
  player = new PIXI.Sprite(
    PIXI.loader.resources["/images/player.png"].texture
  );

  player.x = w_width/2;
  player.y = w_height/2;
  player.anchor.set(0.5, 0.5);
  // player.rotation = 1.57;
  new MovementInput(player);
  stage.addChild(background);
  stage.addChild(player);
  state = play;
  gameLoop();
}


  
  stage.on("mousedown", function(e){  
  console.log('Shooting');
	shoot(player.rotation, {
		x: player.position.x+Math.cos(player.rotation)*20,
		y: player.position.y+Math.sin(player.rotation)*20
	});
  });


function movehandler(event) {
    x = event.data.global.x;
    y = event.data.global.y;
}


function gameLoop() {
  requestAnimationFrame(gameLoop);
  state();
  //player.rotation = Math.PI/2+Math.atan2(y - player.y, x - player.x);
  player.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, player.position.x, player.position.y);
  
  
    for(var b=bullets.length-1;b>=0;b--){
    bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
    bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;
  }
  
  renderer.render(stage);
}

function play() {
  //Use the player's velocity to make it move
  player.x += player.vx;
  player.y += player.vy
}

function shoot(rotation, startPosition){  
  var bullet = new PIXI.Sprite(bulletImg);
  bullet.position.x = startPosition.x;
  bullet.position.y = startPosition.y;
  bullet.rotation = rotation;
  stage.addChild(bullet);
  bullets.push(bullet);
}


function rotateToPoint(mx, my, px, py){  
  var self = this;
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  //var degrees = angle * 180/ Math.PI;
  return angle;
}


