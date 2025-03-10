import {fromLatLon} from 'utm';
import {union, literal, type InferOutput} from 'valibot';

export const CoordinateFormatSchema = union([
  literal('utm'),
  literal('dd'),
  literal('dms'),
]);

export type CoordinateFormat = InferOutput<typeof CoordinateFormatSchema>;

export function formatCoords({
  lon,
  lat,
  format = 'utm',
}: {
  lon: number;
  lat: number;
  format?: CoordinateFormat;
}): string {
  switch (format) {
    case 'dd':
      return formatDD({lat, lon});
    case 'utm':
      return convertToUTM({lat, lon});
    case 'dms':
      return convertToDMS({lat, lon});
    default:
      return convertToUTM({lat, lon});
  }
}

function toDegreesMinutesAndSeconds(coordinate: number) {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = (minutesNotTruncated - minutes) * 60;
  return {
    degrees,
    minutes,
    seconds,
  };
}

export function convertDmsToDd({
  degrees,
  minutes,
  seconds,
}: {
  degrees: number;
  minutes: number;
  seconds: number;
}) {
  return degrees + minutes / 60 + seconds / 3600;
}

// Style from National Geographic style guide
// https://sites.google.com/a/ngs.org/ngs-style-manual/home/L/latitude-and-longitude
function convertToDMS({lat, lon}: {lat: number; lon: number}) {
  const latitude = formatDms(toDegreesMinutesAndSeconds(lat));
  const latitudeCardinal = lat >= 0 ? 'N' : 'S';

  const longitude = formatDms(toDegreesMinutesAndSeconds(lon));
  const longitudeCardinal = lon >= 0 ? 'E' : 'W';
  return `${latitude} ${latitudeCardinal}, ${longitude} ${longitudeCardinal}`;
}

export function convertToUTM({lat, lon}: {lat: number; lon: number}) {
  try {
    const {easting, northing, zoneNum, zoneLetter} = fromLatLon(lat, lon);
    return `UTM ${zoneNum}${zoneLetter} ${easting.toFixed()} ${northing.toFixed()}`;
  } catch {
    // Some coordinates (e.g. < 80S or 84N) cannot be formatted as UTM
    return `${lat >= 0 ? '+' : ''}${lat.toFixed(6)}°, ${
      lon >= 0 ? '+' : ''
    }${lon.toFixed(6)}°`;
  }
}

// Style from National Geographic style guide
// https://sites.google.com/a/ngs.org/ngs-style-manual/home/L/latitude-and-longitude
function formatDD({lat, lon}: {lat: number; lon: number}) {
  const formattedLat = Math.abs(lat).toFixed(6);
  const formattedLon = Math.abs(lon).toFixed(6);
  const latCardinal = lat >= 0 ? 'N' : 'S';
  const lonCardinal = lon >= 0 ? 'E' : 'W';
  return `${formattedLat}° ${latCardinal}, ${formattedLon}° ${lonCardinal}`;
}

function formatDms({
  degrees,
  minutes,
  seconds,
}: {
  degrees: number;
  minutes: number;
  seconds: number;
}) {
  return `${degrees}° ${minutes}' ${seconds.toFixed(3)}"`;
}
