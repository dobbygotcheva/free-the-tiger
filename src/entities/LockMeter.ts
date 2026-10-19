import { Container, Graphics, Text } from 'pixi.js';
import { gsap } from 'gsap';
import { BAR_COUNT } from '../config';

const PIP_WIDTH = 120;
const PIP_HEIGHT = 14;
const PIP_GAP = 7;
const COLOR_ON = 0xffd90f;
const COLOR_OFF = 0x0b4a5a;

/** One segment of the meter: a dark base with a bright overlay that fades in/out. */
class Pip extends Container {
  private readonly glow = new Graphics();

  constructor() {
    super();

    const base = new Graphics()
      .roundRect(-PIP_WIDTH / 2, -PIP_HEIGHT / 2, PIP_WIDTH, PIP_HEIGHT, 5)
      .fill({ color: COLOR_OFF, alpha: 0.75 });

    this.glow
      .roundRect(-PIP_WIDTH / 2, -PIP_HEIGHT / 2, PIP_WIDTH, PIP_HEIGHT, 5)
      .fill(COLOR_ON)
      .stroke({ color: 0x7a5b00, width: 2 });

    this.addChild(base, this.glow);
  }

  setActive(active: boolean, animate: boolean): void {
    const alpha = active ? 1 : 0;
    gsap.killTweensOf(this.glow);
    gsap.killTweensOf(this.scale);

    if (!animate) {
      this.glow.alpha = alpha;
      return;
    }

    gsap.to(this.glow, { alpha, duration: 0.25, ease: 'power1.out' });
    if (!active) {
      gsap.fromTo(this.scale, { x: 1.15, y: 1.6 }, { x: 1, y: 1, duration: 0.35, ease: 'back.out(3)' });
    }
  }
}

/**
 * Shows how many bars are still locked: a big number plus one pip per bar.
 * Lives on the plate, in the plate's local (design-space) coordinates.
 */
export class LockMeter extends Container {
  private readonly pips: Pip[] = [];
  private readonly counter: Text;
  private locked = BAR_COUNT;

  constructor() {
    super();

    const caption = new Text({
      text: 'LOCKED',
      style: {
        fontFamily: 'Impact, "Arial Black", sans-serif',
        fontSize: 22,
        letterSpacing: 4,
        fill: '#ffffff',
        stroke: { color: '#0b2a33', width: 4, join: 'round' },
      },
    });
    caption.anchor.set(0.5);
    caption.resolution = 2;
    caption.position.set(0, -112);

    this.counter = new Text({
      text: String(BAR_COUNT),
      style: {
        fontFamily: 'Impact, "Arial Black", sans-serif',
        fontSize: 84,
        fill: COLOR_ON,
        stroke: { color: '#0b2a33', width: 8, join: 'round' },
      },
    });
    this.counter.anchor.set(0.5);
    this.counter.resolution = 2;
    this.counter.position.set(0, -52);

    this.addChild(caption, this.counter);

    // Pips are stacked top to bottom and drain from the top.
    const firstY = 12;
    for (let i = 0; i < BAR_COUNT; i++) {
      const pip = new Pip();
      pip.position.set(0, firstY + i * (PIP_HEIGHT + PIP_GAP));
      this.pips.push(pip);
      this.addChild(pip);
    }
  }

  /** Back to "everything is locked" (called whenever a new code is generated). */
  reset(): void {
    this.setLocked(BAR_COUNT);
  }

  setLocked(count: number): void {
    const next = Math.max(0, Math.min(BAR_COUNT, count));
    if (next === this.locked) {
      return;
    }
    this.locked = next;

    this.pips.forEach((pip, index) => {
      // The bottom pip is the last one to go dark.
      const fromBottom = BAR_COUNT - 1 - index;
      pip.setActive(fromBottom < next, true);
    });

    this.counter.text = String(next);
    gsap.fromTo(
      this.counter.scale,
      { x: 1.3, y: 1.3 },
      { x: 1, y: 1, duration: 0.35, ease: 'back.out(3)' },
    );
  }
}
