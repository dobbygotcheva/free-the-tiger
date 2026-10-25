import type { Application, Container } from 'pixi.js';
import { DESIGN, LAYOUTS } from '../config';

type LayoutName = keyof typeof LAYOUTS;

/**
 * Keeps the game responsive.
 *
 * - `backdrop` (the jungle picture) is scaled to *cover* the screen and
 *   centred, so there are never empty bars around it.
 * - `content` (cage, tiger, plate...) is scaled to *fit* the layout's frame and
 *   centred on the same screen centre, so cage and plate keep the same relative
 *   position to the background as the screen size changes.
 *
 * There are two arrangements (see `LAYOUTS`): the artwork's own landscape
 * layout, and a portrait one that stacks the plate above the cage. Whichever
 * fits the screen at the bigger scale is used, so tall screens are not left
 * with a tiny scene.
 */
export class ResponsiveLayout {
  constructor(
    private readonly app: Application,
    private readonly backdrop: Container,
    private readonly content: Container,
    private readonly plate: Container,
  ) {}

  /** Starts listening for size changes and applies the current size. */
  attach(): void {
    this.app.renderer.on('resize', () => this.apply());
    this.apply();
  }

  apply(): void {
    const { width, height } = this.app.screen;

    const name = this.pickLayout(width, height);
    const { frame, plate } = LAYOUTS[name];
    const fit = this.fitScale(name, width, height);

    this.plate.position.set(plate.x, plate.y);
    this.content.scale.set(fit);
    this.content.position.set(
      width / 2 - (frame.x + frame.width / 2) * fit,
      height / 2 - (frame.y + frame.height / 2) * fit,
    );

    const cover = Math.max(width / DESIGN.width, height / DESIGN.height);
    this.backdrop.scale.set(cover);
    this.backdrop.position.set(
      (width - DESIGN.width * cover) / 2,
      (height - DESIGN.height * cover) / 2,
    );
  }

  private pickLayout(width: number, height: number): LayoutName {
    return this.fitScale('portrait', width, height) > this.fitScale('landscape', width, height)
      ? 'portrait'
      : 'landscape';
  }

  private fitScale(name: LayoutName, width: number, height: number): number {
    const { frame } = LAYOUTS[name];
    return Math.min(width / frame.width, height / frame.height);
  }
}
