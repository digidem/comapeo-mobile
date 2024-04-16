import {LonLatData} from '../hooks/tracks/useCurrentTrackStore';

const EARTH_RADIUS = 6371; // Radius of the earth in km

const degreesToRadians = (degrees: number): number => degrees * (Math.PI / 180);

export const calculateTotalDistance = (points: LonLatData[]): number =>
  points.reduce((previousValue, currentValue, i, arr) => {
    if (i === 0) {
      return previousValue;
    }

    const pointA = arr[i - 1];
    if (!pointA) {
      throw Error('No point A for i=' + i);
    }

    const pointB = currentValue;

    const dLat = degreesToRadians(pointB.latitude - pointA.latitude);
    const dLon = degreesToRadians(pointB.longitude - pointA.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(pointA.latitude)) *
        Math.cos(degreesToRadians(pointB.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return previousValue + EARTH_RADIUS * c;
  }, 0);
