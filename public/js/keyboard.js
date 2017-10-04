/*
  let leftKey = keyboard(37); // 37 = left arrow
  leftKey.press = function() {...};
  leftKey.release = function() {...};

  Keycodes: http://help.adobe.com/en_US/AS2LCR/Flash_10.0/help.html?content=00000520.html
*/

class Keyboard {
  constructor(keyCode, pressFunc, releaseFunc){
    this.code = keyCode;
    this.isDown = false;
    this.isUp = true;
    this.press = pressFunc;
    this.release = releaseFunc;

    this.attachEventListeners();
  }

  downHandler(event) {
    if (event.keyCode === this.code) {
      if (this.isUp && this.press) this.press();
      this.isDown = true;
      this.isUp = false;
    }
    event.preventDefault();
  };

  upHandler(event) {
    if (event.keyCode === this.code) {
      if (this.isDown && this.release) this.release();
      this.isDown = false;
      this.isUp = true;
    }
    event.preventDefault();
  };

  attachEventListeners(){
    window.addEventListener("keydown", this.downHandler.bind(this), false);
    window.addEventListener("keyup", this.upHandler.bind(this), false);
  }
}