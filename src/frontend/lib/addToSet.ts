export function addToSet<T>(set: Set<T>, toAdd: Iterable<T>): void {
  for (const item of toAdd) set.add(item);
}
