/**
 * Central place for every tweakable number in the game.
 * All coordinates are expressed in "design space" (1280x720); the
 * ResponsiveLayout scales that space to whatever the window size is.
 */

export const DESIGN = {
  width: 1280,
  height: 720,
} as const;

export const ASSET_ROOT = `${import.meta.env.BASE_URL}assets/`;

export const ASSET_FILES = {
  background: 'background.jpg',
  cage: 'cage.png',
  tiger: 'tiger.png',
  bar: 'bar.png',
  barShadow: 'barShadow.png',
  plate: 'plate.png',
  text: 'txt.png',
} as const;

export type AssetKey = keyof typeof ASSET_FILES;

/** Draw order (zIndex) of the scene layers. */
export const Z = {
  cage: 1,
  tiger: 2,
  gate: 3,
  plate: 4,
  tigerFree: 5,
  banner: 6,
} as const;

export const BAR_COUNT = 6;

export const CAGE = {
  x: 646,
  y: 372,
  scale: 0.466,
} as const;

export const GATE = {
  /** y of the three bar rows (top to bottom). */
  rowsY: [332, 417, 503],
  /** x where the outer cap of a left / right bar sits while closed. */
  leftX: 396,
  rightX: 900,
  barScale: 0.97,
  /** How far (design px) a bar travels when it opens. */
  openDistance: 215,
  /** Extra clickable padding (design px) above and below a bar. */
  hitPaddingY: 22,
  shadowOffset: { x: 4, y: 10 },
  shadowAlpha: 0.6,
  openDuration: 0.5,
  slamDuration: 0.2,
} as const;

export const PLATE = {
  x: 175,
  y: 365,
  scale: 0.273,
} as const;

/** Pose of the tiger while it is still locked in the cage and once it is free. */
export const TIGER = {
  /** Point of the artwork (the middle of the eyes) used as pivot for placement. */
  pivot: { x: 635, y: 572 },
  caged: { x: 620, y: 440, scale: 0.3 },
  free: { x: 620, y: 360, scale: 0.55 },
  stepOutDuration: 1.3,
} as const;

export const BANNER = {
  x: 640,
  y: 565,
  scale: 0.385,
  /** Seconds the "Going Wild" scene stays on screen before the reset. */
  showSeconds: 5,
} as const;
