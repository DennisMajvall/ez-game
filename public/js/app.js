//Create the renderer

const mouse = new Mouse();
var player, state, stage, renderer;
var games = [];

var w_width = window.innerWidth;
var w_height = window.innerHeight;

var gameList = [];

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

function setup() {
  player = new Player('Henk');
  player.initialize();

  var newGame = new Game();


  state = play;
  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  state(); // calls play() unless the state-variable points to a different function such as: mainMenu()
  renderer.render(stage);
}

function play() {
  player.update();
}




// Global helper functions
function rotateToPoint(mx, my, px, py){
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  return angle;
}
function radiansToDegrees(angle){ return angle * 180 / Math.PI; }
