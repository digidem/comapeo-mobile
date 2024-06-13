import {getPercentageOfNetworkAvailability} from './networkAvailability';

describe('getPercentageOfNetworkAvailability', () => {
  it('returns 0 for missing `networkAvailable`', () => {
    expect(getPercentageOfNetworkAvailability([{}])).toBe(0);
    expect(getPercentageOfNetworkAvailability([{metadata: {}}])).toBe(0);
    expect(
      getPercentageOfNetworkAvailability([{metadata: {positionProvider: {}}}]),
    ).toBe(0);
  });

  it('returns 0 for one doc with `networkAvailability:false`', () => {
    expect(
      getPercentageOfNetworkAvailability([
        {metadata: {positionProvider: {networkAvailable: false}}},
      ]),
    ).toBe(0);
  });

  it('returns 100 for one doc with `networkAvailability:true`', () => {
    expect(
      getPercentageOfNetworkAvailability([
        {metadata: {positionProvider: {networkAvailable: true}}},
      ]),
    ).toBe(100);
  });

  it('returns a fixed - 2 - number of decimals rounded up', () => {
    expect(
      getPercentageOfNetworkAvailability([
        {metadata: {positionProvider: {networkAvailable: false}}},
        {metadata: {positionProvider: {networkAvailable: true}}},
        {metadata: {positionProvider: {networkAvailable: true}}},
      ]),
    ).toBe(66.67);

    expect(
      getPercentageOfNetworkAvailability([
        {metadata: {positionProvider: {networkAvailable: false}}},
        {metadata: {positionProvider: {networkAvailable: false}}},
        {metadata: {positionProvider: {networkAvailable: true}}},
      ]),
    ).toBe(33.33);
  });

  it('returns 25 for 1 `true` and 3 `false`', () => {
    expect(
      getPercentageOfNetworkAvailability([
        {metadata: {positionProvider: {networkAvailable: false}}},
        {metadata: {positionProvider: {networkAvailable: false}}},
        {metadata: {positionProvider: {networkAvailable: false}}},
        {metadata: {positionProvider: {networkAvailable: true}}},
      ]),
    ).toBe(25);
  });
});
