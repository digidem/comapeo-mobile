import {setIfNotNull} from './setIfNotNull';

describe('setIfNotNull', () => {
  it("doesn't set the value if null", () => {
    const obj: Record<string, unknown> = {};
    setIfNotNull(obj, 'foo', null);
    expect(obj).toEqual({});
  });

  it('sets the value if not null', () => {
    const obj: Record<string, unknown> = {};
    setIfNotNull(obj, 'foo', 123);
    setIfNotNull(obj, 'boo', undefined);
    expect(obj).toEqual({foo: 123, boo: undefined});
  });
});
