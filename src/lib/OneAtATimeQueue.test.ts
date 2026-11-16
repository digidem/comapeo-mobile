import {setTimeout} from 'node:timers/promises';
import {OneAtATimeQueue} from './OneAtATimeQueue';

describe('OneAtATimeQueue', () => {
  it('queues operations to be run one at a time', async () => {
    const queue = new OneAtATimeQueue();

    let opsRunning = 0;
    let opsCompleted = 0;

    const {promise, resolve} = promiseWithResolvers();

    const op = async () => {
      expect(opsRunning).toBe(0);

      opsRunning++;

      await setTimeout(10);

      opsRunning--;
      expect(opsRunning).toBe(0);

      opsCompleted++;

      if (opsCompleted >= 3) {
        resolve();
      }
    };

    queue.add(op);
    queue.add(op);
    queue.add(op);

    await promise;
    expect(opsCompleted).toBe(3);
  });
});

function promiseWithResolvers(): {promise: Promise<void>; resolve: () => void} {
  let resolve: () => void = () => {};
  const promise = new Promise<void>(res => {
    resolve = res;
  });
  return {promise, resolve};
}
