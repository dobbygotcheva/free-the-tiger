import { Container, Graphics, Text } from 'pixi.js';
import { gsap } from 'gsap';
import { BAR_COUNT, EASE, METER, RENDER } from '../config';

const { pip: PIP } = METER;

/** One segment of the meter: a dark base with a bright overlay that fades in/out. */
class Pip extends Container {
  private readonly glow = new Graphics();

  constructor() {
    super();

    const base = new Graphics()
      .roundRect(-PIP.width / 2, -PIP.height / 2, PIP.width, PIP.height, PIP.radius)
      .fill({ color: PIP.colorOff, alpha: PIP.offAlpha });

    this.glow
      .roundRect(-PIP.width / 2, -PIP.height / 2, PIP.width, PIP.height, PIP.radius)
      .fill(PIP.colorOn)
      .stroke({ color: PIP.outlineOn, width: PIP.outlineWidth });

    this.addChild(base, this.glow);
  }

  setActive(active: boolean): void {
    gsap.killTweensOf(this.glow);
    gsap.killTweensOf(this.scale);

    gsap.to(this.glow, {
      alpha: active ? 1 : 0,
      duration: PIP.fadeDuration,
      ease: EASE.meterFade,
    });

    if (!active) {
      gsap.fromTo(
        this.scale,
        { ...PIP.popFrom },
        { x: 1, y: 1, duration: PIP.popDuration, ease: EASE.meterPop },
      );
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
      text: METER.caption.text,
      style: {
        fontFamily: METER.fontFamily,
        fontSize: METER.caption.fontSize,
        letterSpacing: METER.caption.letterSpacing,
        fill: METER.caption.color,
        stroke: { color: METER.outlineColor, width: METER.caption.outlineWidth, join: 'round' },
      },
    });
    caption.anchor.set(0.5);
    caption.resolution = RENDER.textResolution;
    caption.position.set(0, METER.caption.y);

    this.counter = new Text({
      text: String(BAR_COUNT),
      style: {
        fontFamily: METER.fontFamily,
        fontSize: METER.counter.fontSize,
        fill: PIP.colorOn,
        stroke: { color: METER.outlineColor, width: METER.counter.outlineWidth, join: 'round' },
      },
    });
    this.counter.anchor.set(0.5);
    this.counter.resolution = RENDER.textResolution;
    this.counter.position.set(0, METER.counter.y);

    this.addChild(caption, this.counter);

    // Pips are stacked top to bottom and drain from the top.
    for (let i = 0; i < BAR_COUNT; i++) {
      const pip = new Pip();
      pip.position.set(0, PIP.firstY + i * (PIP.height + PIP.gap));
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
      pip.setActive(fromBottom < next);
    });

    this.counter.text = String(next);
    gsap.fromTo(
      this.counter.scale,
      { x: METER.counter.popScale, y: METER.counter.popScale },
      { x: 1, y: 1, duration: METER.counter.popDuration, ease: EASE.meterPop },
    );
  }
}
