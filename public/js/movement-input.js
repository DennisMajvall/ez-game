class MovementInput {
  constructor(target){
    this.target = target;

    this.left = new Keyboard(37,   this.leftPress.bind(this),  this.leftRelease.bind(this));
    this.up = new Keyboard(38,       this.upPress.bind(this),    this.upRelease.bind(this));
    this.right = new Keyboard(39, this.rightPress.bind(this), this.rightRelease.bind(this));
    this.down = new Keyboard(40,   this.downPress.bind(this),  this.downRelease.bind(this));

    target.vx = 0;
    target.vy = 0;

  }

  leftPress() {
    this.target.vx = -5;
  }
  leftRelease() {
    if (!this.right.isDown) {
      this.target.vx = 0;
    }
  }

  upPress() {
    this.target.vy = -5;
  }
  upRelease() {
    if (!this.right.isDown) {
      this.target.vx = 0;
    }
    if (!this.down.isDown) {
      this.target.vy = 0;
    }
  }

  rightPress() {
    this.target.vx = 5;
  }
  rightRelease() {
    if (!this.left.isDown) {
      this.target.vx = 0;
    }
  }

  downPress() {
    this.target.vy = 5;
  }
  downRelease() {
    if (!this.up.isDown) {
      this.target.vy = 0;
    }
  }
}