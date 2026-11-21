/**
 * Converts an unknown error value to an Error instance.
 * Useful for catch blocks and error handlers where the error type is unknown.
 *
 * @param err - The caught error value (can be anything)
 * @param fallbackMessage - Message to use if err is not an Error instance
 * @returns An Error instance
 */
export function toError(err: unknown, fallbackMessage: string): Error {
  if (err instanceof Error) {
    return err;
  }
  return new Error(fallbackMessage);
}

/**
 * Reads the code off an error that reached us on an event payload. core's
 * `getErrorCode` cannot: it requires an `instanceof Error`, and only a
 * rejection is put back together as one on this side of ipc.
 */
export function getEventErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }
  return typeof error.code === 'string' ? error.code : undefined;
}
