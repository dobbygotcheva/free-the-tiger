import { Container, type Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { BAR_COUNT, GATE, Z } from '../config';
import { waitForAnimation } from '../utils/async';
import { Bar } from './Bar';

/**
 * The six bars locking the cage. Knows which bars are open, lets the game
 * `await` the player's next press and animates the group (slam / reset).
 */
export class Gate extends Container {
  private readonly bars: Bar[] = [];
  private pendingPress: ((bar: Bar) => void) | null = null;

  constructor(barTexture: Texture, shadowTexture: Texture) {
    super();
    this.zIndex = Z.gate;

    const perSide = BAR_COUNT / 2;
    for (let i = 0; i < BAR_COUNT; i++) {
      const bar = new Bar({
        number: i + 1,
        side: i < perSide ? 'left' : 'right',
        y: GATE.rowsY[i % perSide],
        texture: barTexture,
        shadowTexture,
        onPress: (pressed) => this.handlePress(pressed),
      });
      this.bars.push(bar);
      this.addChild(bar);
    }
  }

  /** Resolves with the next bar the player presses. */
  waitForBarPress(): Promise<Bar> {
    return new Promise<Bar>((resolve) => {
      this.pendingPress = resolve;
    });
  }

  getBar(number: number): Bar {
    const bar = this.bars[number - 1];
    if (!bar) {
      throw new Error(`There is no bar number ${number}`);
    }
    return bar;
  }

  /** Wrong bar: every open bar slams shut while the culprit wobbles. */
  async slamShut(wrongBar: Bar): Promise<void> {
    const slams = this.bars.filter((bar) => bar.isOpen).map((bar) => bar.slamShut());
    await Promise.all([...slams, wrongBar.wobble()]);
    await waitForAnimation(
      gsap.fromTo(this, { x: -6 }, { x: 0, duration: 0.3, ease: 'elastic.out(1.2, 0.2)' }),
    );
  }

  /** Slides every open bar back into place (scene reset after a win). */
  async closeAll(): Promise<void> {
    await Promise.all(this.bars.filter((bar) => bar.isOpen).map((bar) => bar.close()));
  }

  private handlePress(bar: Bar): void {
    const resolve = this.pendingPress;
    if (!resolve) {
      return; // input is locked (animation in progress)
    }
    this.pendingPress = null;
    resolve(bar);
  }
}
