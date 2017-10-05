class PixiSprite{

  constructor(name){
    const rootFolder = "/images/";

    let sprite = new PIXI.Sprite(
      PIXI.loader.resources[rootFolder + name].texture
    );

    sprite.anchor.set(0.5, 0.5);

    return sprite;
  }

}