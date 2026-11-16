type Comparable = number | string;

export function maxBy<ItemT, SortT extends Comparable>(
  iterable: Iterable<ItemT>,
  iteratee: (item: ItemT) => SortT,
): undefined | ItemT {
  let maxItem: ItemT | undefined;
  let maxSortValue: SortT | undefined;

  for (const item of iterable) {
    const sortValue = iteratee(item);

    if (maxSortValue === undefined || sortValue > maxSortValue) {
      maxSortValue = sortValue;
      maxItem = item;
    }
  }

  return maxItem;
}
