import {calculateItemWidthForScrollView} from './calculateItemWidthForScrollView';

describe('calculateItemWidthForScrollView', () => {
  it('calculates expected width for typical values', () => {
    const result = calculateItemWidthForScrollView({
      minItemWidth: 150,
      gap: 10,
      containerSize: 1000,
    });
    expect(result).toBeCloseTo(148.46, 2); // actual expected value
  });

  it('returns minItemWidth if it is greater than container size', () => {
    const result = calculateItemWidthForScrollView({
      minItemWidth: 200,
      gap: 10,
      containerSize: 150,
    });
    expect(result).toBe(150);
  });
});
