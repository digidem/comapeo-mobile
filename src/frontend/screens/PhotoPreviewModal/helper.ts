import {point} from '@turf/helpers';
import {distance} from '@turf/distance';

export function calculateDistanceFromObservation({
  photoLocation,
  observationLocation,
}: {
  photoLocation: [number, number];
  observationLocation: [number, number];
}): number {
  const photoPoint = point(photoLocation);
  const observationPoint = point(observationLocation);
  return distance(photoPoint, observationPoint);
}

export function calcPhotoTimeRelativeToObs({
  photoCreatedAt,
  observationCreatedAt,
}: {
  photoCreatedAt: number;
  observationCreatedAt: number;
}): number {
  const diffInMilliseconds = Math.abs(observationCreatedAt - photoCreatedAt);
  return diffInMilliseconds / 1000 / 60;
}
