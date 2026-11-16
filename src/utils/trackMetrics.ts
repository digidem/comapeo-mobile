import {Track} from '@comapeo/schema';
import {LocationHistoryPoint} from '../sharedTypes/location';
import {calculateTotalDistance} from './distance';

/**
 * Converts the track schema's locations to a simpler format.
 */
export function getLocationHistoryFromTrack(
  track: Track,
): LocationHistoryPoint[] {
  return track.locations.map(loc => ({
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
    timestamp: Date.parse(loc.timestamp),
  }));
}

export function getTrackDurationAndDistance(locations: LocationHistoryPoint[]) {
  if (!locations || locations.length < 2) {
    return {durationMs: 0, distance: 0};
  }

  const sorted = [...locations].sort((a, b) => a.timestamp - b.timestamp);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const durationMs = first && last ? last.timestamp - first.timestamp : 0;
  const distance = calculateTotalDistance(sorted);

  return {durationMs, distance};
}
