/*      How to use:
    const CollisionManager = require('./collision-manager');    // import the file
    CollisionManager.register('Player', this);    // register self to the CollisionManager
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
    CollisionManager.checkAgainst = this.checkAgainst;

    this.players = [];
    this.resourceNodes = [];
    this.bullets = [];
    this.buildings = [];
    this.monsters = [];
  }

  update(){
    this.updateTwo(this.players, this.resourceNodes);
    this.updateTwo(this.players, this.bullets);
    this.updateTwo(this.bullets, this.resourceNodes);
  }

  register(type, item) {
    let c = new Circle(item, type);
    this[type+'s'].push(c);
    return c;
  }

  remove(type, item) {
    let arr = this[type+'s'];
    const i = arr.findIndex((data)=>{return (data.target == item)});
    if(i != -1){
      arr.splice(i, 1);
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
        let combinedRadius = this.radius(a,b);

        // If hit
        if (distance <= combinedRadius){

          // Only sqrt after a hit has occured
          distance = Math.sqrt(distance);
          combinedRadius = Math.sqrt(combinedRadius);

          // Let the involved objects handle the collision.
          let done = a.onCollision && a.onCollision(b, distance, combinedRadius);
          !done && b.onCollision && b.onCollision(a, distance, combinedRadius);

          // If either collision function returns true, don't check against others in arrB.
          if(done) { break; }
        }
      }
    }
  }

  // Returns false OR an object with keys: other, distance, combinedRadius
  checkAgainst(a, arrayName) {
    let arrB = this[arrayName];
    if (arrB === undefined) { console.error('ERROR, CollisionManager.checkAgainst:', arrayName); }

    for (let other of arrB){
      let distance = this.distBetween(a, other);
      let combinedRadius = this.radius(a, other);

      if (distance <= combinedRadius){
        distance = Math.sqrt(distance);
        combinedRadius = Math.sqrt(combinedRadius);

        return { other: other, distance, combinedRadius };
      }
    }

    return false;
  }
}