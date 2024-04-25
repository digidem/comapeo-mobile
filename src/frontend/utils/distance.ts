import CheapRuler from 'cheap-ruler';
import {LonLatData} from '../sharedTypes/location';

export const calculateTotalDistance = (points: LonLatData[]): number => {
  if (points.length <= 1) {
    return 0;
  }

  const ruler = new CheapRuler(points[0]!.latitude, 'kilometers');

  return ruler.lineDistance(
    points.map(point => [point.longitude, point.latitude]),
  );
};
