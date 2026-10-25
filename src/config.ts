/**
 * Central place for every tweakable number in the game.
 * All coordinates are expressed in "design space" (1280x720); the
 * ResponsiveLayout scales that space to whatever the window size is.
 */

export const DESIGN = {
  width: 1280,
  height: 720,
} as const;

export const RENDER = {
  backgroundColor: '#0b1d1a',
  /** Upper limit for the renderer resolution (keeps retina screens fast). */
  maxResolution: 2,
  /** Resolution of the Text objects, so they stay sharp when the scene scales up. */
  textResolution: 2,
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

/** GSAP easing curves used by the animations. */
export const EASE = {
  barOpen: 'power2.out',
  barSlam: 'power4.in',
  barClose: 'power2.inOut',
  barWobble: 'elastic.out(1.2, 0.25)',
  tiger: 'power2.inOut',
  bannerShow: 'back.out(2)',
  bannerHide: 'power1.in',
  meterFade: 'power1.out',
  meterPop: 'back.out(3)',
} as const;

export const BAR_COUNT = 6;

/**
 * Two arrangements of the same scene.
 *
 * `frame` is the part of design space that has to fit on screen and `plate`
 * is where the plate sits inside it. Landscape is the original artwork layout
 * (plate left of the cage, frame = whole 1280x720 picture, so it lines up with
 * the background). Portrait stacks the plate above the cage, which needs a much
 * narrower frame and therefore allows a bigger scale on tall screens.
 * The layout that gives the larger scale is picked automatically.
 */
export const LAYOUTS = {
  landscape: {
    frame: { x: 0, y: 0, width: DESIGN.width, height: DESIGN.height },
    plate: { x: 175, y: 365 },
  },
  portrait: {
    // Bars slide 215px out of the cage on both sides; the tiger's tail reaches
    // about x=1125 and the plate sits above the tiger's highest point.
    frame: { x: 175, y: -274, width: 950, height: 989 },
    plate: { x: 650, y: -110 },
  },
} as const;

export const CAGE = {
  x: 647,
  y: 376,
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
  /** Duration of the gentle slide back into the cage (scene reset). */
  closeDuration: 0.6,
  /** How far a bar rebounds after slamming shut / being pressed wrongly. */
  wobbleDistance: 8,
  wobbleDuration: 0.35,
  label: {
    fontFamily: 'Impact, "Arial Black", sans-serif',
    fontSize: 26,
    color: '#ffffff',
    outlineColor: '#0b2a33',
    outlineWidth: 5,
    /** Distance of the number from the outer end of the bar. */
    offset: 54,
  },
} as const;

export const PLATE = {
  scale: 0.273,
} as const;

/** The lock counter drawn on the plate (coordinates are relative to the plate centre). */
export const METER = {
  fontFamily: 'Impact, "Arial Black", sans-serif',
  outlineColor: '#0b2a33',
  caption: {
    text: 'LOCKED',
    fontSize: 22,
    letterSpacing: 4,
    color: '#ffffff',
    outlineWidth: 4,
    y: -112,
  },
  counter: { fontSize: 84, outlineWidth: 8, y: -52, popScale: 1.3, popDuration: 0.35 },
  pip: {
    width: 120,
    height: 14,
    gap: 7,
    radius: 5,
    firstY: 12,
    colorOn: 0xffd90f,
    colorOff: 0x0b4a5a,
    outlineOn: 0x7a5b00,
    outlineWidth: 2,
    /** Squash-and-stretch the pip starts from when it goes dark. */
    popFrom: { x: 1.15, y: 1.6 },
    offAlpha: 0.75,
    fadeDuration: 0.25,
    popDuration: 0.35,
  },
} as const;

/** Pose of the tiger while it is still locked in the cage and once it is free. */
export const TIGER = {
  /** Point of the artwork (the middle of the eyes) used as pivot for placement. */
  pivot: { x: 635, y: 572 },
  caged: { x: 618, y: 438, scale: 0.3 },
  free: { x: 618, y: 354, scale: 0.55 },
  stepOutDuration: 1.3,
  stepBackDuration: 0.6,
} as const;

export const BANNER = {
  x: 640,
  y: 565,
  scale: 0.385,
  /** Start tilt (radians) of the pop-in animation. */
  startRotation: -0.12,
  showDuration: 0.6,
  hideDuration: 0.4,
  /** Seconds the "Going Wild" scene stays on screen before the reset. */
  showSeconds: 5,
} as const;
