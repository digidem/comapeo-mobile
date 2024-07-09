/**
 * Ponyfill for [`Map.groupBy`][0].
 *
 * [0]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy
 */
export function mapGroupBy<ItemT, KeyT>(
  items: Iterable<ItemT>,
  callbackFn: (value: ItemT, index: number) => KeyT,
): Map<KeyT, Array<ItemT>> {
  const result = new Map<KeyT, Array<ItemT>>();

  let index = 0;

  for (const item of items) {
    const key = callbackFn(item, index);

    const existingGroup = result.get(key);
    if (existingGroup) {
      existingGroup.push(item);
    } else {
      result.set(key, [item]);
    }

    index++;
  }

  return result;
}
