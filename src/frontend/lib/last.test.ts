import {last} from './last';

describe('last', () => {
  it('returns undefined for empty arrays', () => {
    expect(last([])).toBeUndefined();
  });

  it('returns the last element of an array', () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  it('works with array-likes', () => {
    expect(last({length: 0})).toBeUndefined();
    expect(last({length: 3, '0': 1, '1': 2, '2': 3})).toBe(3);
  });
});
