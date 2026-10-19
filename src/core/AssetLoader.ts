import { Assets, Texture } from 'pixi.js';
import { ASSET_FILES, ASSET_ROOT, type AssetKey } from '../config';

/** Loads every texture once and hands them out by key. */
export class AssetLoader {
  private readonly textures = new Map<AssetKey, Texture>();

  async load(): Promise<void> {
    const keys = Object.keys(ASSET_FILES) as AssetKey[];

    for (const key of keys) {
      Assets.add({ alias: key, src: `${ASSET_ROOT}${ASSET_FILES[key]}` });
    }

    const loaded = await Assets.load<Texture>(keys);
    for (const key of keys) {
      this.textures.set(key, loaded[key]);
    }
  }

  get(key: AssetKey): Texture {
    const texture = this.textures.get(key);
    if (!texture) {
      throw new Error(`Texture "${key}" requested before it was loaded`);
    }
    return texture;
  }
}
