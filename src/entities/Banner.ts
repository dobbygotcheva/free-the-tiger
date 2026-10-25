import { Sprite, type Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { BANNER, EASE, Z } from '../config';

/** The "Going Wild!" text shown when the tiger gets free. */
export class Banner extends Sprite {
  constructor(texture: Texture) {
    super(texture);
    this.anchor.set(0.5);
    this.position.set(BANNER.x, BANNER.y);
    this.zIndex = Z.banner;
    this.visible = false;
  }

  /** Uniform scale as a single number, so GSAP can tween it together with the rotation. */
  get zoom(): number {
    return this.scale.x;
  }

  set zoom(value: number) {
    this.scale.set(value);
  }

  async show(): Promise<void> {
    this.visible = true;
    this.alpha = 1;
    this.zoom = 0;
    this.rotation = BANNER.startRotation;

    await gsap.to(this, {
      zoom: BANNER.scale,
      rotation: 0,
      duration: BANNER.showDuration,
      ease: EASE.bannerShow,
    });
  }

  async hide(): Promise<void> {
    await gsap.to(this, { alpha: 0, duration: BANNER.hideDuration, ease: EASE.bannerHide });
    this.visible = false;
  }
}
