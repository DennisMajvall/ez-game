class Mouse {
  constructor(){
    if (Mouse.instance) { return Mouse.instance; }
	this.rotation = 0;
  }

  bindSocket(socket){
    if (this.socket) { return; } // don't attach listeners more than once
    this.socket = socket;

    renderer.plugins.interaction.on('pointerdown', (e)=>{
	var x = e.data.global.x/w_width;	
	var y = e.data.global.y/w_height;
   	
      socket.emit('mouseDown', {x:x,y:y});
    });

	
	setInterval (()=>{
	  let rotationAngle = rotateToPoint(this.x, this.y, player.x, player.y);
	
	  if(rotationAngle != this.rotation){
		this.rotation = rotationAngle;
	    socket.emit('rotation', rotationAngle);
	  }
	}, 50);
 //   renderer.plugins.interaction.on('pointermove', (e)=>{
 // });
  }
  
  

  get x(){
    return renderer.plugins.interaction.mouse.global.x;
  }

  get y(){
    return renderer.plugins.interaction.mouse.global.y;
  }
}