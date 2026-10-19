import { Container, Sprite, type Texture } from 'pixi.js';
import { PLATE, Z } from '../config';
import { LockMeter } from './LockMeter';

/** The blue plate on the left side of the background. Hosts the lock meter. */
export class Plate extends Container {
  readonly meter = new LockMeter();

  constructor(texture: Texture) {
    super();

    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.scale.set(PLATE.scale);
    this.addChild(sprite, this.meter);

    this.position.set(PLATE.x, PLATE.y);
    this.zIndex = Z.plate;
  }
}
