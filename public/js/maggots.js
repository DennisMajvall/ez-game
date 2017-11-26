class Maggots {
  constructor() {
    this.maggots = [];
    this.count = 0;

    const scale = 0.4;

    for (var i = 0; i < 500; i++) {
      var m = new PixiSprite('maggot.png');
      stage.addChild(m);

      m.direction = Math.random() * Math.PI * 2;
      m.speed = 25;
      m.turnSpeed = Math.random() - 0.8;

      m.x = Math.random() * 10000;
      m.y = Math.random() * 10000;

      m.scale.set(scale + Math.random() * (scale * 0.25));
      m.original = new PIXI.Point();
      m.original.copy(m.scale);
      this.maggots.push(m);
    }
  }

  update() {
    this.count += 2.5 * deltaTime;

    for (let m of this.maggots) {
      const speed = m.speed * deltaTime;
      m.direction += m.turnSpeed * 0.01;
      m.x += Math.sin(m.direction) * speed;
      m.y += Math.cos(m.direction) * speed;

      m.rotation = -m.direction - Math.PI / 2;
      m.scale.x = m.original.x + Math.sin(this.count) * 0.15;

      // wrap the maggots around as the crawl
      if (m.x < -1000) {
        m.x += 12000;
      } else if (m.x > 12000) {
        m.x -= 12000;
      }

      if (m.y < -1000) {
        m.y += 12000;
      } else if (m.y > 12000) {
        m.y -= 12000;
      }
    }
  };


}