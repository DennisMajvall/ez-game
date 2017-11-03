// Globals
const mouse = new Mouse();
const keyboard = new Keyboard();
let stage, renderer;
let deltaTime = 1/60;

// TODO: on resize event: change size of canvas etc..
$(window).on('resize', function(){
  if (!renderer) { return; }
  let w = $(this);
  renderer.resize(w.width(), w.height());
  stage.position.x = renderer.width/2;
  stage.position.y = renderer.height/2;
});

class App {
  constructor() {
    this.timeElapsed = 0;
    this.initRenderer();
    this.initStage();

    this.game = new Game();
    this.state = this.game.update.bind(this.game);

    this.loadTextures().load((a,b,c)=> {
      this.game.initPostLoad();

      this.gameLoop();
    });
  }

  initRenderer(){
    renderer = PIXI.autoDetectRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x6b8155,
      antialias: true
    });
    document.getElementById('display').appendChild(renderer.view);
  }

  initStage(){
    stage = new PIXI.Container();
    stage.interactive = true;
    stage.position.x = renderer.width/2;
    stage.position.y = renderer.height/2;
  }

  loadTextures(){
    return PIXI.loader
      .add("/images/shotgun.png")
      .add("/images/axe.png")
      .add("/images/tree.png")
      .add("/images/bullet.png")
      .add("/images/stone.png")
      .add("/images/maggot.png")
      .add("/images/wall.png");
  }

  connectToServer(playerName) {
    this.socket = io();
    this.game.bindSocket(playerName);
    mouse.bindSocket();
    keyboard.bindSocket();
  }

  gameLoop(dt = 0.1) {
    deltaTime = (dt - this.timeElapsed) / 1000;
    this.timeElapsed = dt;
    this.state();
    renderer.render(stage);
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  AppStart(playerName){
    this.connectToServer(playerName);
  }
}
// Start the application
let app = new App();


function startGame(element){
  let playerName = $('#txtName').val() || 'Unknown';
  $(element).parent().hide();
  app.AppStart(playerName);
}

// Global helper functions
function radiansToDegrees(angle){ return angle * 180 / Math.PI; }
function rotateToPoint(mx, my, px, py){
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  return angle;
}
