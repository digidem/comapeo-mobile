import {convertToUTM} from './utils';

describe('convertToUTM', () => {
  it('converts latitude + longitude to UTM format', () => {
    expect(convertToUTM({lat: 12, lon: -34})).toBe('UTM 25P 391136 1326751');
  });
});
