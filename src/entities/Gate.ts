import { Container, type EventSystem, type Texture } from 'pixi.js';
import { BAR_COUNT, GATE, Z } from '../config';
import { Bar } from './Bar';

/**
 * The six bars locking the cage. Knows which bars are open, lets the game
 * `await` the player's next press and animates the group (slam / reset).
 *
 * The bars only react to the pointer while the game is actually waiting for a
 * press; during every animation (slam, win, reset) the whole gate is disabled,
 * so the pointer cursor never suggests that a click would count.
 *
 * PIXI only re-evaluates the cursor from a hit test, and it does so when the
 * mouse moves or clicks. Disabling the gate alone would leave the "pointer"
 * hand showing while the mouse rests on a bar, so the gate resets it itself.
 */
export class Gate extends Container {
  private readonly bars: Bar[] = [];
  private pendingPress: ((bar: Bar) => void) | null = null;

  constructor(
    barTexture: Texture,
    shadowTexture: Texture,
    private readonly events: EventSystem,
  ) {
    super();
    this.zIndex = Z.gate;
    this.interactiveChildren = false;

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
      this.interactiveChildren = true;
    });
  }

  /**
   * Wrong bar: every open bar slams shut (and rebounds) while the wrongly
   * pressed bar rattles. The other, still closed bars stay perfectly still.
   */
  async slamShut(wrongBar: Bar): Promise<void> {
    const slams = this.bars.filter((bar) => bar.isOpen).map((bar) => bar.slamShut());
    await Promise.all([...slams, wrongBar.wobble()]);
  }

  /** Slides every open bar back into place (scene reset after a win). */
  async closeAll(): Promise<void> {
    await Promise.all(this.bars.filter((bar) => bar.isOpen).map((bar) => bar.close()));
  }

  private disableInput(): void {
    this.interactiveChildren = false;

    // PIXI applies `rootBoundary.cursor` again right after the click handler
    // returns, so that value has to be reset too, not just the canvas style.
    this.events.rootBoundary.cursor = 'default';
    this.events.setCursor('default');
  }

  private handlePress(bar: Bar): void {
    const resolve = this.pendingPress;
    if (!resolve) {
      return; // input is locked (animation in progress)
    }
    this.pendingPress = null;
    this.disableInput();
    resolve(bar);
  }
}
