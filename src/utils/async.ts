import { gsap } from 'gsap';

/**
 * Promise based sleep driven by GSAP's ticker (no setTimeout / setInterval).
 * @param seconds how long to wait
 */
export function delay(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    gsap.delayedCall(seconds, resolve);
  });
}

/**
 * Turns a GSAP animation into a plain Promise<void>.
 * (Awaiting the tween directly resolves with the tween itself, which is
 * usually not what we want to pass around.)
 */
export function finished(animation: gsap.core.Animation): Promise<void> {
  return new Promise<void>((resolve) => {
    if (animation.progress() === 1) {
      resolve();
      return;
    }
    animation.eventCallback('onComplete', resolve);
    // A killed animation never completes, so resolve on interrupt as well.
    animation.eventCallback('onInterrupt', resolve);
  });
}
