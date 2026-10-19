# Free the Tiger

A small browser game built for the Wildcard frontend challenge. Open the cage in
the secret order and let the tiger out.

Built with **TypeScript**, **PIXI.js 8** and **GSAP 3**, bundled by **Vite**.

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Then open the printed URL (usually <http://localhost:5173>).

## Build

```bash
npm run build      # type-checks, then writes the production bundle to ./dist
npm run preview    # serves ./dist locally to try the production build
```

`npm run typecheck` runs the TypeScript compiler on its own.

The build uses a relative base path, so the contents of `dist/` can be hosted
from any folder (GitHub Pages, itch.io, a plain static server...).

## How to play

1. Six bars lock the cage: bars **1-3** on the left, **4-6** on the right,
   numbered top to bottom.
2. A random code (the numbers 1-6 in random order) is written to the **browser
   console** - open the dev tools and look for `[Free the Tiger] Code: ...`.
3. Click the bars in exactly that order. A correct bar slides out (left bars
   to the left, right bars to the right).
4. Open all six and the tiger walks out. **Going Wild!** is shown for 5 seconds,
   then the scene resets with a new code.
5. Click a wrong bar and every open bar slams shut. A new code is generated and
   you start again.

The meter on the plate shows how many bars are still locked (6 -> 0) and goes
back to 6 whenever a new code is generated.

## Project structure

```
src/
  main.ts                  entry point
  Game.ts                  builds the scene and runs the round loop (async/await)
  config.ts                every layout / timing constant (design space 1280x720)
  core/
    AssetLoader.ts         loads and hands out textures
    CodeGenerator.ts       random permutation of 1..6
    ResponsiveLayout.ts    fits the scene to any window size
  entities/
    Cage.ts  Plate.ts  LockMeter.ts  Tiger.ts  Banner.ts
    Bar.ts                 one numbered bar (+ shadow), slides / slams
    Gate.ts                the six bars, awaits the player's next click
  utils/
    async.ts               GSAP backed delay() and tween -> Promise helper
public/assets/             artwork supplied with the challenge
```

## Notes

- **Responsive:** the scene lives in a 1280x720 design space. It is scaled to
  fit the window (and centred) while the jungle background is scaled to cover it,
  so it works on desktop, tablet and phone sizes and reacts to resizing.
- **No timers:** waiting is done with awaited GSAP tweens / `gsap.delayedCall`;
  the code base does not use `setTimeout` or `setInterval`.
- **Commits / branches:** Conventional Commits, kebab-case branch names.
