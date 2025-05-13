class AbortError extends Error {
  readonly name = 'AbortError';
  constructor() {
    super('The operation was aborted');
  }
}

/**
 * Throw an error if the given `AbortSignal` is aborted.
 *
 * Similar to `AbortSignal.prototype.throwIfAborted`, but handles the case where
 * `reason` is missing, which is the case in React Native.
 */
export function throwIfAborted(
  signal: Readonly<{aborted: boolean; reason?: unknown}>,
) {
  if (signal.aborted) throw signal.reason || new AbortError();
}
