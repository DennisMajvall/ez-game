class Mouse {
  constructor(){
    if (Mouse.instance) {
      return Mouse.instance;
    }

    // stage.mousemove = this.movehandler.bind(this);

    // Alternative to the bind-shit above.
    // stage.mousemove = function(event){
    //   this.movehandler(event);
    // };

    // Also the same thing (alternative)
    // stage.mousemove = (e)=>this.movehandler(event);
  }

  // movehandler(event) {
  //   this.x = event.data.global.x;
  //   this.y = event.data.global.y;
  // }

  get x(){
    return renderer.plugins.interaction.mouse.global.x;
  }

  get y(){
    return renderer.plugins.interaction.mouse.global.y;
  }
}