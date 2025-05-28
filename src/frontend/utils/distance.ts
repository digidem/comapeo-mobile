import {length} from '@turf/length';
import {lineString} from '@turf/helpers';
import {LonLatData} from '../sharedTypes/location';

export const calculateTotalDistance = ({
  points,
  units,
}: {
  points: LonLatData[];
  units: 'meters' | 'kilometers';
}): number => {
  if (points.length < 2) {
    return 0;
  }

  return length(
    lineString(points.map(point => [point.longitude, point.latitude])),
    {units},
  );
};
