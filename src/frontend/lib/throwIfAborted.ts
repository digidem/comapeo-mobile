/**
 * Ponyfill of `AbortSignal.prototype.throwIfAborted`, which is not supported
 * in our version of Node.
 */
export default function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw signal.reason;
}
