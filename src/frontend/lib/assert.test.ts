import assert from './assert';

describe('assert', () => {
  it('does nothing when the value is truthy', () => {
    expect(() => {
      assert(true);
      assert(true, 'ok');
      assert('good', 'ok');
    }).not.toThrow();
  });

  it('throws when the value is falsy', () => {
    expect(() => assert(false)).toThrow();
    expect(() => assert(false, 'bad')).toThrow('bad');
    expect(() => assert(null, 'bad')).toThrow('bad');
  });
});
