//Create the renderer

var player, state, stage, renderer;

var w_width = window.innerWidth;
var w_height = window.innerHeight;

renderer = PIXI.autoDetectRenderer(w_width, w_height, {
  antialias: false,
  transparent: false,
  resolution: 1
});
// renderer.autoResize = true;
document.body.appendChild(renderer.view);

stage = new PIXI.Container();
stage.interactive = true;
stage.mousemove = movehandler;

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

  stage.addChild(player);

  state = play;
  gameLoop();
}

function movehandler(event) {
    const x = event.data.global.x;
    const y = event.data.global.y;
	Math.PI/4
    player.rotation = Math.PI/2+Math.atan2(y - player.y, x - player.x);
}


function gameLoop() {
  requestAnimationFrame(gameLoop);
  state();
  renderer.render(stage);
}

function play() {
  //Use the player's velocity to make it move
  player.x += player.vx;
  player.y += player.vy
}