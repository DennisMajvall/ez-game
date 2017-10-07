class Mouse {
  constructor(){
    if (Mouse.instance) { return Mouse.instance; }
  }

  bindSocket(socket){
    if (this.socket) { return; } // don't attach listeners more than once
    this.socket = socket;

    renderer.plugins.interaction.on('pointerdown', (e)=>{
      socket.emit('mouseDown', e.data.global);
    });

    renderer.plugins.interaction.on('pointermove', (e)=>{
      let rotationAngle = rotateToPoint(e.data.global.x, e.data.global.y, w_width/2, w_height/2);
      // rotation will be from -PI to +PI  (minus is North side)
      // socket.emit('rotation', rotationAngle);
    });
  }

  get x(){
    return renderer.plugins.interaction.mouse.global.x;
  }

  get y(){
    return renderer.plugins.interaction.mouse.global.y;
  }
}