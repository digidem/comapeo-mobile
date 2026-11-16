import CheapRuler from 'cheap-ruler';
import {LonLatData} from '../sharedTypes/location';

/**
 * Calculates the sum of distances between each point provided in `points`.
 * It is important to note that the result can change depending on how this function is used with a given set of points.
 * Due to how geographic coordinate systems and global projections work, the following may not be equivalent:
 *
 * @example
 * ```ts
 * // This...
 * calculateTotalDistance([a, b, c])
 *
 * // ...may not be the same as this
 * calculateTotalDistance([a, b]) + calculateTotalDistance([b, c])
 * ```
 *
 * If `a` and `b` have a large enough difference in latitude,
 * the calculations in the provided example will have different results despite using the same set of points.
 *
 * @returns The total distance in kilometers.
 */
export const calculateTotalDistance = (points: LonLatData[]): number => {
  if (points.length <= 1) {
    return 0;
  }

  const ruler = new CheapRuler(points[0]!.latitude, 'kilometers');

  return ruler.lineDistance(
    points.map(point => [point.longitude, point.latitude]),
  );
};
