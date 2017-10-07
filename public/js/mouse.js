class Mouse {
  constructor(){
    if (Mouse.instance) { return Mouse.instance; }
	  this.rotation = 0;
  }

  bindSocket(socket){
    if (this.socket) { return; } // don't attach listeners more than once
    this.socket = socket;

    renderer.plugins.interaction.on('pointerdown', (e)=>{
      socket.emit('mouseDown', {x: this.x, y: this.y, rot: this.rotation});
    });


    setInterval (()=>{
      let rotationAngle = rotateToPoint(this.x, this.y, w_width/2, w_height/2);

      if(rotationAngle != this.rotation){
        this.rotation = rotationAngle;
        socket.emit('rotation', rotationAngle);
      }
    }, 50);
  }



  get x(){
    return renderer.plugins.interaction.mouse.global.x;
  }

  get y(){
    return renderer.plugins.interaction.mouse.global.y;
  }
}