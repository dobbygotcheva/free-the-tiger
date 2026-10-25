import { gsap } from 'gsap';

/**
 * Promise based sleep driven by GSAP's ticker (no browser timers involved).
 * @param seconds how long to wait
 */
export function delay(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    gsap.delayedCall(seconds, resolve);
  });
}

/**
 * Promise that settles when an animation that *may be killed* is over.
 *
 * Awaiting a GSAP tween directly is fine - and preferred - when nothing can
 * interrupt it, but a killed tween never completes and the `await` would hang
 * forever. This helper also resolves when the animation is interrupted (killed
 * or overwritten), so it is used for the bar slides, which get cancelled when a
 * wrong bar slams the open ones shut.
 */
export function waitForAnimation(animation: gsap.core.Animation): Promise<void> {
  return new Promise<void>((resolve) => {
    if (animation.progress() === 1) {
      resolve();
      return;
    }
    animation.eventCallback('onComplete', resolve);
    animation.eventCallback('onInterrupt', resolve);
  });
}
