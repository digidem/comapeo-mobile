export const last = <T>(arr: Readonly<ArrayLike<T>>): undefined | T =>
  arr[arr.length - 1];
