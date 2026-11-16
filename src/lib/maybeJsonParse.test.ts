import {maybeJsonParse} from './maybeJsonParse';

describe('maybeJsonParse', () => {
  it('returns undefined when failing to parse JSON', () => {
    expect(maybeJsonParse('{bad')).toBeUndefined();
  });

  it('parses valid JSON', () => {
    expect(maybeJsonParse('null')).toBeNull();
    expect(maybeJsonParse('{"foo":"bar"}')).toEqual({foo: 'bar'});
  });
});
