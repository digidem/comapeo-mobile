/**
 * Get the first value from an iterable, or `undefined` if the iterable is empty.
 *
 * Like `myArray[0]`, but works for other iterables like `Set`s.
 */
export function first<T>(iterable: Iterable<T>): undefined | T {
  for (const value of iterable) return value;
}
