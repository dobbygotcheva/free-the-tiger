import { Application, Container, Sprite } from 'pixi.js';
import { AssetLoader } from './core/AssetLoader';
import { ResponsiveLayout } from './core/ResponsiveLayout';
import { Cage } from './entities/Cage';
import { Plate } from './entities/Plate';
import { Tiger } from './entities/Tiger';

/** Owns the PIXI application and wires every part of the game together. */
export class Game {
  private readonly app = new Application();
  private readonly assets = new AssetLoader();

  private readonly backdrop = new Container();
  private readonly scene = new Container();

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
  }

  private buildScene(): void {
    this.backdrop.addChild(new Sprite(this.assets.get('background')));

    this.scene.sortableChildren = true;
    this.scene.addChild(
      new Cage(this.assets.get('cage')),
      new Tiger(this.assets.get('tiger')),
      new Plate(this.assets.get('plate')),
    );

    this.app.stage.addChild(this.backdrop, this.scene);
  }
}
