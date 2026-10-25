import { Sprite, type Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { EASE, TIGER, Z } from '../config';

/**
 * The tiger. It crouches behind the bars and, once the cage is open,
 * steps forward out of it.
 */
export class Tiger extends Sprite {
  constructor(texture: Texture) {
    super(texture);
    this.pivot.set(TIGER.pivot.x, TIGER.pivot.y);
    this.resetPose();
  }

  /** Uniform scale as a single number, so GSAP can tween position and size in one go. */
  get zoom(): number {
    return this.scale.x;
  }

  set zoom(value: number) {
    this.scale.set(value);
  }

  /** Puts the tiger back inside the cage, behind the bars. */
  resetPose(): void {
    this.position.set(TIGER.caged.x, TIGER.caged.y);
    this.zoom = TIGER.caged.scale;
    this.zIndex = Z.tiger;
  }

  /** Walks out of the cage towards the camera. */
  async stepOut(): Promise<void> {
    // Once it leaves the cage the tiger has to be drawn in front of the bars.
    this.zIndex = Z.tigerFree;

    await gsap.to(this, {
      x: TIGER.free.x,
      y: TIGER.free.y,
      zoom: TIGER.free.scale,
      duration: TIGER.stepOutDuration,
      ease: EASE.tiger,
    });
  }

  /** Walks back into the cage. */
  async stepBack(): Promise<void> {
    // The bars close in front of the tiger, so it goes behind them right away.
    this.zIndex = Z.tiger;

    await gsap.to(this, {
      x: TIGER.caged.x,
      y: TIGER.caged.y,
      zoom: TIGER.caged.scale,
      duration: TIGER.stepBackDuration,
      ease: EASE.tiger,
    });
  }
}
