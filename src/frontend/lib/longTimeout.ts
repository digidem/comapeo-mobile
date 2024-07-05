import {assert} from './assert';

const MAX_REAL_DELAY = 2 ** 30;

const clear = Symbol('clear');

class LongTimeout {
  #realTimeout: null | ReturnType<typeof setTimeout> = null;

  constructor(fn: () => unknown, delay: number) {
    assert(delay >= 0, 'setLongTimeout cannot be called with a negative delay');

    let remainingDelay = delay;

    const step = () => {
      if (remainingDelay > MAX_REAL_DELAY) {
        remainingDelay -= MAX_REAL_DELAY;
        this.#realTimeout = setTimeout(step, MAX_REAL_DELAY);
      } else {
        this.#realTimeout = setTimeout(fn, remainingDelay);
      }
    };

    step();
  }

  [clear](): void {
    if (this.#realTimeout) {
      clearTimeout(this.#realTimeout);
      this.#realTimeout = null;
    }
  }
}

/**
 * `setTimeout` has a [maximum delay value of ~25 days][0]. This lets us set
 * timers longer than that. Its API should otherwise match `setTimeout`.
 *
 * [0]: https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
 */
export const setLongTimeout = (fn: () => unknown, delay: number): LongTimeout =>
  new LongTimeout(fn, delay);

/**
 * Clear a long timeout.
 */
export const clearLongTimeout = (timeout: LongTimeout): void =>
  timeout[clear]();
