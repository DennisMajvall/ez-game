//Create the renderer

const mouse = new Mouse();
const keyboard = new Keyboard();
var player= {};

var state, stage, renderer;

var w_width = window.innerWidth;
var w_height = window.innerHeight;



// TODO: on resize event: change size of canvas etc..
renderer = PIXI.autoDetectRenderer(w_width, w_height, {
  antialias: false,
  transparent: false,
  resolution: 1
});
renderer.autoResize = true;
document.getElementById('display').appendChild(renderer.view);


stage = new PIXI.Container();
stage.interactive = true;
stage.position.x = renderer.width/2;
stage.position.y = renderer.height/2;

var background = new PIXI.Graphics();
background.beginFill(0x768f5a); // NICE GREEN COLOR: rgb(118, 143, 90)
background.drawRect(0,0,w_width,w_height);
background.endFill();
stage.addChild(background);




PIXI.loader
  .add("/images/player.png")
  .add("/images/tree.png")
  .add("/images/bullet.png")
  .add("/images/rock.png")
  .load(setup);


let players = {};
let bullets = [];

function setup() {
  let socket = io();
  attachSocketListeners(socket);

  state = play;
  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  state();
  renderer.render(stage);
}

function play(){
  for(let b of bullets){
    b.x += b.vx;
    b.y += b.vy;
  }

  stage.pivot.x = player.x;
  stage.pivot.y = player.y;
  player.rotation = mouse.rotation;
}

function addPlayer(playerId, p){
  players[playerId] = new PixiSprite('player.png');
  stage.addChild(players[playerId]);
}

function renderPlayer(playerId, p){
  players[playerId].x = p.x;
  players[playerId].y = p.y;

  if (playerId != player.id) {
    players[playerId].rotation = p.rotation;
  }
}

function attachSocketListeners(socket) {
  socket.on('playerId', function(playerId) {
    player = players[playerId];
    player.id = playerId;
  });

  socket.on('playerPositions', function(data) {
    for (let key in data){
      let value = data[key]

      if (players[key] == undefined) {
        addPlayer(key, value);
      }

      renderPlayer(key, value);
    }
  });

  socket.on('bulletSpawn', function(data){
    const speed = 10;
	  var bullet = new PixiSprite('bullet.png');
	  bullet.x = data.x;
	  bullet.y = data.y;
	  bullet.rotation = data.rotation;

	  bullet.vx = Math.cos(bullet.rotation) * speed;
      bullet.vy = Math.sin(bullet.rotation) * speed;
	  bullets.push(bullet);

	 stage.addChild(bullet);
  });
  
  socket.on('removePlayer',function(data){
	stage.removeChild(players[data]);  
  });

  mouse.bindSocket(socket);
  keyboard.bindSocket(socket);
}






// // Global helper functions
function rotateToPoint(mx, my, px, py){
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  return angle;
}
// function radiansToDegrees(angle){ return angle * 180 / Math.PI; }
