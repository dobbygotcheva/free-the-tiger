import type { Application, Container } from 'pixi.js';
import { DESIGN } from '../config';

/**
 * Keeps the game responsive.
 *
 * - `content` (cage, tiger, plate...) is scaled uniformly to *fit* the screen
 *   ("contain") and centred, so nothing important is ever cropped.
 * - `backdrop` is scaled to *cover* the screen, so there are no empty bars
 *   around the jungle picture on ultra-wide or portrait screens.
 */
export class ResponsiveLayout {
  constructor(
    private readonly app: Application,
    private readonly backdrop: Container,
    private readonly content: Container,
  ) {}

  /** Starts listening for size changes and applies the current size. */
  attach(): void {
    this.app.renderer.on('resize', () => this.apply());
    this.apply();
  }

  apply(): void {
    const { width, height } = this.app.screen;

    const fit = Math.min(width / DESIGN.width, height / DESIGN.height);
    this.content.scale.set(fit);
    this.content.position.set(
      (width - DESIGN.width * fit) / 2,
      (height - DESIGN.height * fit) / 2,
    );

    const cover = Math.max(width / DESIGN.width, height / DESIGN.height);
    this.backdrop.scale.set(cover);
    this.backdrop.position.set(
      (width - DESIGN.width * cover) / 2,
      (height - DESIGN.height * cover) / 2,
    );
  }
}
