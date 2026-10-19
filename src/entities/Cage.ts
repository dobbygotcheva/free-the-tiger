import { Container, Sprite, type Texture } from 'pixi.js';
import { CAGE, Z } from '../config';

/** The cage artwork (everything except the sliding bars). */
export class Cage extends Container {
  constructor(texture: Texture) {
    super();

    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    this.addChild(sprite);

    this.position.set(CAGE.x, CAGE.y);
    this.scale.set(CAGE.scale);
    this.zIndex = Z.cage;
  }
}
