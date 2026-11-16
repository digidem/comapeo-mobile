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
