import throwIfAborted from './throwIfAborted';

export default function sleep(
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
        reject(signal.reason);
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
