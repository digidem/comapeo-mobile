import {
  metersOrConversion,
  kmOrConversion,
  metersPerSecondOrConversion,
} from './unitConversion';

describe('metersOrConversion', () => {
  it('returns meters in metric', () => {
    expect(metersOrConversion(10, 'metric')).toEqual({value: 10, unit: 'm'});
    expect(metersOrConversion(10.75, 'metric')).toEqual({
      value: 10.75,
      unit: 'm',
    });
    expect(metersOrConversion(0.4, 'metric')).toEqual({value: 0.4, unit: 'm'});
  });

  it('converts to feet in imperial', () => {
    expect(metersOrConversion(1, 'imperial')).toEqual({
      value: 3.28084,
      unit: 'ft',
    });
    expect(metersOrConversion(10, 'imperial')).toEqual({
      value: 32.8084,
      unit: 'ft',
    });
    expect(metersOrConversion(100, 'imperial')).toEqual({
      value: 328.084,
      unit: 'ft',
    });
  });
});

describe('kmOrConversion', () => {
  it('returns km in metric', () => {
    expect(kmOrConversion(1, 'metric')).toEqual({value: 1, unit: 'km'});
    expect(kmOrConversion(5.678, 'metric')).toEqual({value: 5.678, unit: 'km'});
  });

  it('converts to miles in imperial', () => {
    expect(kmOrConversion(1, 'imperial')).toEqual({
      value: 0.621371,
      unit: 'mi',
    });
    expect(kmOrConversion(10, 'imperial')).toEqual({
      value: 6.21371,
      unit: 'mi',
    });
    expect(kmOrConversion(0, 'imperial')).toEqual({value: 0, unit: 'mi'});
  });
});

describe('metersPerSecondOrConversion', () => {
  it('returns m/s in metric', () => {
    expect(metersPerSecondOrConversion(1, 'metric')).toEqual({
      value: 1,
      unit: 'm/s',
    });
    expect(metersPerSecondOrConversion(9.81, 'metric')).toEqual({
      value: 9.81,
      unit: 'm/s',
    });
  });

  it('converts to ft/s in imperial', () => {
    expect(metersPerSecondOrConversion(1, 'imperial')).toEqual({
      value: 3.28084,
      unit: 'ft/s',
    });
    expect(metersPerSecondOrConversion(10, 'imperial')).toEqual({
      value: 32.8084,
      unit: 'ft/s',
    });
    expect(metersPerSecondOrConversion(0, 'imperial')).toEqual({
      value: 0,
      unit: 'ft/s',
    });
  });
});
