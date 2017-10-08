class Keyboard {
  constructor(){
    if (Keyboard.instance) { return Keyboard.instance; }

    this.keysDown = {};
    this.keyMapping = {
      'up': [ 'w', 'arrowup'],
      'right': [ 'd', 'arrowright'],
      'down': [ 's', 'arrowdown'],
      'left': [ 'a', 'arrowleft']
    };
  }

  bindSocket(){
    if (this.socket) { return; } // don't attach listeners more than once
    this.socket = app.socket;

    document.body.onkeydown = this.onKeyDown.bind(this);
    document.body.onkeyup = this.onKeyUp.bind(this);
  }

  onKeyDown(e){
    if (this.keysDown[e.key]) { return; } // return if key is already down
    this.keysDown[e.key] = true;

    let action = this.getActionFromKey(e);
    if (action) { this.socket.emit('keyboardDown', action); }
  }

  onKeyUp(e){
    delete this.keysDown[e.key];

    let action = this.getActionFromKey(e);
    if (action) { this.socket.emit('keyboardUp', action); }
  };

  getActionFromKey(e){
    for (let action in this.keyMapping){
      if (this.keyMapping[action].includes(e.key.toLowerCase())){
        return action;
      }
    }
    return false;
  }
}

