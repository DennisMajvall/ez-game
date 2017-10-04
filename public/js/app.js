//Create the renderer

var cat, state, stage, renderer;

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

PIXI.loader
  .add("/images/anon.jpg") // 128x128
  .load(setup);

function setup() {
  cat = new PIXI.Sprite(
    PIXI.loader.resources["/images/anon.jpg"].texture
  );

  cat.x = w_width/2;
  cat.y = w_height/2;
  cat.anchor.set(0.5, 0.5);
  // cat.rotation = 1.57;
  new MovementInput(cat);

  stage.addChild(cat);

  state = play;
  gameLoop();
}


function gameLoop() {
  requestAnimationFrame(gameLoop);
  state();
  renderer.render(stage);
}

function play() {
  //Use the cat's velocity to make it move
  cat.x += cat.vx;
  cat.y += cat.vy
}