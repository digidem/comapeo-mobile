/**
 * Ponyfill of `AbortSignal.prototype.throwIfAborted`, which is not supported
 * in our version of Node.
 */
export function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw signal.reason;
}
