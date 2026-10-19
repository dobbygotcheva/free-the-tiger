import { Sprite, type Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { TIGER, Z } from '../config';
import { finished } from '../utils/async';

/**
 * The tiger. It crouches behind the bars and, once the cage is open,
 * steps forward out of it.
 */
export class Tiger extends Sprite {
  private motion: gsap.core.Tween | null = null;

  constructor(texture: Texture) {
    super(texture);
    this.pivot.set(TIGER.pivot.x, TIGER.pivot.y);
    this.resetPose();
  }

  /** Puts the tiger back inside the cage, behind the bars. */
  resetPose(): void {
    this.motion?.kill();
    this.motion = null;
    this.position.set(TIGER.caged.x, TIGER.caged.y);
    this.scale.set(TIGER.caged.scale);
    this.zIndex = Z.tiger;
  }

  /** Walks out of the cage towards the camera. */
  async stepOut(): Promise<void> {
    // Once it leaves the cage the tiger has to be drawn in front of the bars.
    this.zIndex = Z.tigerFree;

    this.motion = gsap.to(this, {
      x: TIGER.free.x,
      y: TIGER.free.y,
      duration: TIGER.stepOutDuration,
      ease: 'power2.inOut',
    });
    const scaling = gsap.to(this.scale, {
      x: TIGER.free.scale,
      y: TIGER.free.scale,
      duration: TIGER.stepOutDuration,
      ease: 'power2.inOut',
    });

    await Promise.all([finished(this.motion), finished(scaling)]);
  }

  /** Slides the tiger back to its cage pose. */
  async stepBack(duration = 0.6): Promise<void> {
    this.motion?.kill();
    const move = gsap.to(this, {
      x: TIGER.caged.x,
      y: TIGER.caged.y,
      duration,
      ease: 'power2.inOut',
    });
    const scaling = gsap.to(this.scale, {
      x: TIGER.caged.scale,
      y: TIGER.caged.scale,
      duration,
      ease: 'power2.inOut',
    });
    await Promise.all([finished(move), finished(scaling)]);
    this.resetPose();
  }
}
