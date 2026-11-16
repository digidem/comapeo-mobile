import {throwIfAborted} from './throwIfAborted';

export function sleep(
  ms: number,
  options?: Readonly<{signal?: AbortSignal}>,
): Promise<void> {
  const signal = options?.signal;

  if (signal) {
    return new Promise((resolve, reject) => {
      throwIfAborted(signal);

      const timeout = setTimeout(() => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      }, ms);

      const onAbort = () => {
        clearTimeout(timeout);
        // Use the `reason` if it exists. It doesn't currently in React Native,
        // but we want to be ready in case it's added.
        const reason =
          'reason' in signal ? signal.reason : new Error('Aborted');
        reject(reason);
        signal.removeEventListener('abort', onAbort);
      };
      signal.addEventListener('abort', onAbort);
    });
  } else {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}
