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
  inspect(){ return this.type; }
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
    // this.updateTwo(this.players, this.resourceNodes);
  }

  registerPlayer(p){
    this.players.push(new Circle(p, 'Player: ' + p.id));
  }

  registerResourceNode(r){
    this.resourceNodes.push(new Circle(r, 'ResourceNode: ' + r.type));
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
        if (this.distBetween(a,b) < this.radius(a,b)){
          let done = a.onCollision && a.onCollision(b);
          !done && b.onCollision && a.onCollision(a);
          if(done) { break; }
        }
      }
    }
  }
}