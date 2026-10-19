import { Application, Container, Sprite } from 'pixi.js';
import { AssetLoader } from './core/AssetLoader';
import { CodeGenerator } from './core/CodeGenerator';
import { ResponsiveLayout } from './core/ResponsiveLayout';
import { BANNER, BAR_COUNT } from './config';
import { Banner } from './entities/Banner';
import { Cage } from './entities/Cage';
import { Gate } from './entities/Gate';
import { Plate } from './entities/Plate';
import { Tiger } from './entities/Tiger';
import { delay } from './utils/async';

/** Owns the PIXI application, builds the scene and runs the round loop. */
export class Game {
  private readonly app = new Application();
  private readonly assets = new AssetLoader();
  private readonly codes = new CodeGenerator(BAR_COUNT);

  private readonly backdrop = new Container();
  private readonly scene = new Container();

  private gate!: Gate;
  private tiger!: Tiger;
  private banner!: Banner;

  constructor(private readonly host: HTMLElement) {}

  async start(): Promise<void> {
    await this.app.init({
      resizeTo: window,
      background: '#0b1d1a',
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.host.appendChild(this.app.canvas);

    await this.assets.load();
    this.buildScene();
    new ResponsiveLayout(this.app, this.backdrop, this.scene).attach();

    await this.run();
  }

  private buildScene(): void {
    this.backdrop.addChild(new Sprite(this.assets.get('background')));

    this.gate = new Gate(this.assets.get('bar'), this.assets.get('barShadow'));
    this.tiger = new Tiger(this.assets.get('tiger'));
    this.banner = new Banner(this.assets.get('text'));

    this.scene.sortableChildren = true;
    this.scene.addChild(
      new Cage(this.assets.get('cage')),
      this.tiger,
      this.gate,
      new Plate(this.assets.get('plate')),
      this.banner,
    );

    this.app.stage.addChild(this.backdrop, this.scene);
  }

  /** Endless loop: new code -> play a round -> celebrate (if won) -> repeat. */
  private async run(): Promise<void> {
    for (;;) {
      const code = this.codes.generate();
      console.log(`[Free the Tiger] Code: ${code.join(', ')}`);

      const freed = await this.playRound(code);
      if (freed) {
        await this.celebrate();
      }
    }
  }

  /** Resolves with true when the cage was opened in the right order. */
  private async playRound(code: readonly number[]): Promise<boolean> {
    const slides: Promise<void>[] = [];

    for (const expected of code) {
      const bar = await this.gate.waitForBarPress();

      if (bar.barNumber !== expected) {
        await this.gate.slamShut(bar);
        return false;
      }
      slides.push(bar.open());
    }

    await Promise.all(slides);
    return true;
  }

  private async celebrate(): Promise<void> {
    await this.tiger.stepOut();
    await this.banner.show();
    await delay(BANNER.showSeconds);

    await Promise.all([this.banner.hide(), this.tiger.stepBack(), this.gate.closeAll()]);
  }
}
