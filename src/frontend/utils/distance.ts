import CheapRuler from 'cheap-ruler';
import {LonLatData} from '../sharedTypes/location';

export const calculateTotalDistance = (points: LonLatData[]): number => {
  if (points.length <= 1) {
    return 0;
  }

  const ruler = new CheapRuler(points[0]!.latitude, 'kilometers');

  return points.reduce((previousValue, currentValue, i, arr) => {
    if (i === 0) {
      return previousValue;
    }

    const pointA = arr[i - 1]!!;
    const pointB = currentValue;
    const distance = ruler.distance(
      [pointA.longitude, pointA.latitude],
      [pointB.longitude, pointB.latitude],
    );

    return previousValue + distance;
  }, 0);
};
