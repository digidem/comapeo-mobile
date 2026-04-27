import {
  metersOrConversion,
  kmOrConversion,
  metersPerSecondOrConversion,
} from './unitConversion';

describe('metersOrConversion', () => {
  it('returns meters with 0 decimal places in metric', () => {
    expect(metersOrConversion(10, 'metric')).toEqual({value: '10', unit: 'm'});
    expect(metersOrConversion(10.75, 'metric')).toEqual({
      value: '11',
      unit: 'm',
    });
    expect(metersOrConversion(0.4, 'metric')).toEqual({value: '0', unit: 'm'});
  });

  it('converts to feet in imperial', () => {
    // 1m * 3.28084 = 3.28084 → '3'
    expect(metersOrConversion(1, 'imperial')).toEqual({value: '3', unit: 'ft'});
    // 10m * 3.28084 = 32.8084 → '33'
    expect(metersOrConversion(10, 'imperial')).toEqual({
      value: '33',
      unit: 'ft',
    });
    // 100m * 3.28084 = 328.084 → '328'
    expect(metersOrConversion(100, 'imperial')).toEqual({
      value: '328',
      unit: 'ft',
    });
  });
});

describe('kmOrConversion', () => {
  it('returns km with 2 decimal places in metric', () => {
    expect(kmOrConversion(1, 'metric')).toEqual({
      value: '1.00',
      unit: 'km',
    });
    expect(kmOrConversion(5.678, 'metric')).toEqual({
      value: '5.68',
      unit: 'km',
    });
  });

  it('converts to miles in imperial', () => {
    // 1km * 0.621371 = 0.621371 → '0.62'
    expect(kmOrConversion(1, 'imperial')).toEqual({
      value: '0.62',
      unit: 'mi',
    });
    // 10km * 0.621371 = 6.21371 → '6.21'
    expect(kmOrConversion(10, 'imperial')).toEqual({
      value: '6.21',
      unit: 'mi',
    });
    expect(kmOrConversion(0, 'imperial')).toEqual({
      value: '0.00',
      unit: 'mi',
    });
  });
});

describe('metersPerSecondOrConversion', () => {
  it('returns m/s with 2 decimal places in metric', () => {
    expect(metersPerSecondOrConversion(1, 'metric')).toEqual({
      value: '1.00',
      unit: 'm/s',
    });
    expect(metersPerSecondOrConversion(9.81, 'metric')).toEqual({
      value: '9.81',
      unit: 'm/s',
    });
  });

  it('converts to mph in imperial', () => {
    // 1 m/s * 2.23694 = 2.23694 → '2.24'
    expect(metersPerSecondOrConversion(1, 'imperial')).toEqual({
      value: '2.24',
      unit: 'mph',
    });
    // 10 m/s * 2.23694 = 22.3694 → '22.37'
    expect(metersPerSecondOrConversion(10, 'imperial')).toEqual({
      value: '22.37',
      unit: 'mph',
    });
    expect(metersPerSecondOrConversion(0, 'imperial')).toEqual({
      value: '0.00',
      unit: 'mph',
    });
  });
});
