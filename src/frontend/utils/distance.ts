import {LonLatData} from '../sharedTypes/location';

const EARTH_RADIUS = 6371; // Radius of the earth in km

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function calculateHaversine(
  deltaLatitude: number,
  deltaLongitude: number,
  pointA: LonLatData,
  pointB: LonLatData,
): number {
  const deltaLatitudeHalfSineSquared = Math.pow(Math.sin(deltaLatitude / 2), 2);
  const pointALatitudeRadianCosine = Math.cos(
    degreesToRadians(pointA.latitude),
  );
  const pointBLatitudeRadianCosine = Math.cos(
    degreesToRadians(pointB.latitude),
  );
  const deltaLongitudeHalfSineSquared = Math.pow(
    Math.sin(deltaLongitude / 2),
    2,
  );

  const cosineProduct = pointALatitudeRadianCosine * pointBLatitudeRadianCosine;

  const haversine =
    deltaLatitudeHalfSineSquared +
    cosineProduct * deltaLongitudeHalfSineSquared;

  return haversine;
}

//   deltaLatitude: number,
//   deltaLongitude: number,
//   pointA: LonLatData,
//   pointB: LonLatData,
// ): number {
//   const deltaLatitudeHalfSineSquared = Math.pow(Math.sin(deltaLatitude / 2), 2);
//   const pointALatitudeRadianCosine = Math.cos(
//     degreesToRadians(pointA.latitude),
//   );
//   const pointBLatitudeRadianCosine = Math.cos(
//     degreesToRadians(pointB.latitude),
//   );
//   const deltaLongitudeHalfSineSquared = Math.pow(
//     Math.sin(deltaLongitude / 2),
//     2,
//   );

//   const cosineProduct =
//     pointALatitudeRadianCosine *
//     pointBLatitudeRadianCosine *
//     deltaLongitudeHalfSineSquared;
//   const haversine = deltaLatitudeHalfSineSquared + cosineProduct;

//   return haversine;
// }

// Based on https://en.wikipedia.org/wiki/Haversine_formula
export const calculateTotalDistance = (points: LonLatData[]): number =>
  points.reduce((previousValue, currentValue, i, arr) => {
    if (i === 0) {
      return previousValue;
    }

    const pointA = arr[i - 1]!!;
    const pointB = currentValue;

    const deltaLatitude = degreesToRadians(pointB.latitude - pointA.latitude);
    const deltaLongitude = degreesToRadians(
      pointB.longitude - pointA.longitude,
    );

    const haversine = calculateHaversine(
      deltaLatitude,
      deltaLongitude,
      pointA,
      pointB,
    );

    const distanceFactor =
      2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return previousValue + EARTH_RADIUS * distanceFactor;
  }, 0);
