import { Container, Rectangle, Sprite, Text, type Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { GATE } from '../config';
import { finished } from '../utils/async';

export type BarSide = 'left' | 'right';

export interface BarOptions {
  /** 1..6, top to bottom (1-3 live on the left, 4-6 on the right). */
  number: number;
  side: BarSide;
  /** y position (design space) of the bar's centre line. */
  y: number;
  texture: Texture;
  shadowTexture: Texture;
  onPress: (bar: Bar) => void;
}

/**
 * One bar of the cage. Left bars slide out to the left, right bars to the right.
 * The bar's origin is its outer end, which is also where the number is drawn.
 */
export class Bar extends Container {
  readonly barNumber: number;
  readonly side: BarSide;

  private readonly direction: 1 | -1;
  private readonly closedX: number;
  private readonly body: Sprite;
  private slide: gsap.core.Tween | null = null;
  private opened = false;

  constructor(options: BarOptions) {
    super();

    this.barNumber = options.number;
    this.side = options.side;
    this.direction = options.side === 'left' ? -1 : 1;
    this.closedX = options.side === 'left' ? GATE.leftX : GATE.rightX;

    // The shadow is a child of the bar, so it travels with it whenever the bar
    // slides out or slams shut. It is added first so it is drawn underneath.
    this.addChild(this.createShadow(options.shadowTexture));

    // The artwork has its cap on the left; right bars are mirrored.
    this.body = new Sprite(options.texture);
    this.body.anchor.set(0, 0.5);
    this.body.scale.set(-this.direction * GATE.barScale, GATE.barScale);
    this.addChild(this.body);

    this.addChild(this.createLabel());

    this.position.set(this.closedX, options.y);
    this.setupInteraction(options.onPress);
  }

  get isOpen(): boolean {
    return this.opened;
  }

  /** Slides the bar out of the cage. */
  open(): Promise<void> {
    this.opened = true;
    this.eventMode = 'none';
    this.cursor = 'default';
    return this.slideTo(
      this.closedX + this.direction * GATE.openDistance,
      GATE.openDuration,
      'power2.out',
    );
  }

  /** Throws the bar back into the cage, fast and hard. */
  async slamShut(): Promise<void> {
    await this.slideTo(this.closedX, GATE.slamDuration, 'power4.in');
    this.lock();
  }

  /** Gently returns the bar to its closed position (used by the scene reset). */
  async close(duration = 0.6): Promise<void> {
    await this.slideTo(this.closedX, duration, 'power2.inOut');
    this.lock();
  }

  /** Short horizontal wobble used to point out the wrongly pressed bar. */
  async wobble(): Promise<void> {
    const wobble = gsap.fromTo(
      this,
      { x: this.closedX - 8 },
      { x: this.closedX, duration: 0.35, ease: 'elastic.out(1.2, 0.25)' },
    );
    this.slide = wobble;
    await finished(wobble);
  }

  private lock(): void {
    this.opened = false;
    this.eventMode = 'static';
    this.cursor = 'pointer';
  }

  private slideTo(x: number, duration: number, ease: string): Promise<void> {
    this.slide?.kill();
    this.slide = gsap.to(this, { x, duration, ease });
    return finished(this.slide);
  }

  private createShadow(texture: Texture): Sprite {
    const shadow = new Sprite(texture);
    shadow.anchor.set(0, 0.5);
    shadow.scale.set(-this.direction * GATE.barScale, GATE.barScale);
    shadow.alpha = GATE.shadowAlpha;
    shadow.position.set(GATE.shadowOffset.x, GATE.shadowOffset.y);
    return shadow;
  }

  private createLabel(): Text {
    const label = new Text({
      text: String(this.barNumber),
      style: {
        fontFamily: 'Impact, "Arial Black", sans-serif',
        fontSize: 26,
        fill: '#ffffff',
        stroke: { color: '#0b2a33', width: 5, join: 'round' },
      },
    });
    label.anchor.set(0.5);
    label.resolution = 2;
    label.position.set(-this.direction * 54, 0);
    return label;
  }

  private setupInteraction(onPress: (bar: Bar) => void): void {
    const width = this.body.texture.width * GATE.barScale;
    const height = this.body.texture.height * GATE.barScale + GATE.hitPaddingY * 2;
    // Generous, bar-shaped hit area that follows the bar while it slides.
    const x = this.direction === -1 ? 0 : -width;
    this.hitArea = new Rectangle(x, -height / 2, width, height);

    this.lock();
    this.on('pointertap', () => onPress(this));
  }
}
