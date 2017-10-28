class Mouse {
  constructor(){
    if (Mouse.instance) { return Mouse.instance; }
	  this.rotation = 0;
  }

  bindSocket(){
    if (this.socket) { return; } // don't attach listeners more than once
    this.socket = app.socket;

    renderer.plugins.interaction.on('pointerdown', (e)=>{
      this.socket.emit('mouseDown', {x: this.x, y: this.y, rot: this.rotation});
      if (this.mouseListener){
        this.mouseListener('click');
      }
    });

    renderer.plugins.interaction.on('pointerup', (e)=>{
      this.socket.emit('mouseUp', {x: this.x, y: this.y, rot: this.rotation});
    });


    setInterval (()=>{
      let rotationAngle = rotateToPoint(this.x, this.y, renderer.width/2, renderer.height/2);

      if(rotationAngle != this.rotation){
        this.rotation = rotationAngle;
        this.socket.emit('rotation', rotationAngle);
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