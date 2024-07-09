import {mapGroupBy} from './mapGroupBy';

describe('mapGroupBy', () => {
  it('returns an empty map when passed an empty list', () => {
    const fn = jest.fn();
    expect(mapGroupBy([], fn)).toEqual(new Map());
    expect(fn).not.toHaveBeenCalled();
  });

  it('groups values', () => {
    expect(mapGroupBy([1, 2, 3, 2], n => n * n)).toEqual(
      new Map([
        [1, [1]],
        [4, [2, 2]],
        [9, [3]],
      ]),
    );
  });
});
