/*      How to use:
    const CollisionManager = require('./collision-manager');    // import the file
    CollisionManager.registerPlayer(this);    // register self to the CollisionManager
    In your class, add the method: onCollision(otherObject){...}
*/

class Circle {
  constructor(target, type) {
    this.type = type;
    this.onCollision = target.onCollision && target.onCollision.bind(target);
    this.target = target;
  }

  get x() { return this.target.x; }
  get y() { return this.target.y; }
  get radius() { return this.target.radius; }

  // Overrides what happens when we console.log on this object
  inspect(){ return `${this.type} (${Math.round(this.x)},${Math.round(this.y)}) radius: ${this.radius}`; }
}

module.exports = new class CollisionManager {
  constructor() {
    if (CollisionManager.instance) { return CollisionManager.instance; }
    CollisionManager.instance = this;

    this.players = [];
    this.resourceNodes = [];
    this.bullets = [];
  }

  update(){
    // Disabled for now since it's not finished yet.
    this.updateTwo(this.players, this.resourceNodes);
    this.updateTwo(this.players, this.bullets);
  }

  registerPlayer(p){
    let c = new Circle(p, 'Player');
    this.players.push(c);
    return c;
  }

  registerResourceNode(r){
    let c = new Circle(r, 'ResourceNode')
    this.resourceNodes.push(c);
    return c;
  }

  registerBullet(b){
    let c = new Circle(b, 'Bullet')
    this.bullets.push(c);
    return c;
  }

  removeBullet(b){


    let i = this.bullets.findIndex((data)=>{return (data.target == b)});
    if(i != -1){
      this.bullets.splice(i,1);
    }
  }

  distBetween(a, b){
    const x = (b.x - a.x);
    const y = (b.y - a.y);
    return x*x + y*y
  }

  radius(a,b){
    const r = a.radius + b.radius;
    return r*r;
  }

  updateTwo(arrA, arrB){
    for (let a of arrA){
      for (let b of arrB){
        let distance = this.distBetween(a,b);
        if (distance <= this.radius(a,b)){
          distance = Math.sqrt(distance);
          let done = a.onCollision && a.onCollision(b, distance);
          !done && b.onCollision && b.onCollision(a, distance);
          if(done) { break; }
        }
      }
    }
  }
}