import { Sprite, type Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { BANNER, Z } from '../config';
import { finished } from '../utils/async';

/** The "Going Wild!" text shown when the tiger gets free. */
export class Banner extends Sprite {
  constructor(texture: Texture) {
    super(texture);
    this.anchor.set(0.5);
    this.position.set(BANNER.x, BANNER.y);
    this.zIndex = Z.banner;
    this.visible = false;
  }

  async show(): Promise<void> {
    this.visible = true;
    this.alpha = 1;
    this.scale.set(0);
    this.rotation = -0.12;

    await Promise.all([
      finished(
        gsap.to(this.scale, {
          x: BANNER.scale,
          y: BANNER.scale,
          duration: 0.6,
          ease: 'back.out(2)',
        }),
      ),
      finished(gsap.to(this, { rotation: 0, duration: 0.6, ease: 'back.out(2)' })),
    ]);
  }

  async hide(): Promise<void> {
    await finished(gsap.to(this, { alpha: 0, duration: 0.4, ease: 'power1.in' }));
    this.visible = false;
  }
}
