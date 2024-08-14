import {first} from './first';

describe('first', () => {
  it('returns undefined for empty iterables', () => {
    expect(first([])).toBeUndefined();
    expect(first(new Set())).toBeUndefined();
  });

  it('returns the first element of an iterable', () => {
    expect(first([1, 2, 3])).toBe(1);
    expect(first(new Set([1, 2, 3]))).toBe(1);
  });
});
