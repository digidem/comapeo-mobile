import {maxBy} from './maxBy';

describe('maxBy', () => {
  it('returns undefined for empty lists', () => {
    const fn = jest.fn();
    expect(maxBy([], fn)).toBeUndefined();
    expect(fn).not.toHaveBeenCalled();
  });

  it('returns the largest value', () => {
    const list = [
      {name: 'red', age: 9},
      {name: 'green', age: 3},
      {name: 'blue', age: 8},
    ];
    expect(maxBy(list, o => o.age)?.name).toBe('red');
  });

  it('returns the first value if there is a tie', () => {
    const list = [
      {name: 'red', age: 9},
      {name: 'green', age: 3},
      {name: 'blue', age: 9},
    ];
    expect(maxBy(list, o => o.age)?.name).toBe('red');
  });
});
