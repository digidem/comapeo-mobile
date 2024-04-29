export type CoordinateField = 'lat' | 'lon';

export type Coordinates = {lat?: number; lon?: number};

export type ConvertedCoordinateData = {
  coords?: Coordinates;
  error?: Error;
};

export type FormProps = {
  initialCoordinates?: {lat: number; lon: number};
  onValueUpdate: (convertedCoordinates: ConvertedCoordinateData) => void;
};

// Adapted from https://stackoverflow.com/a/7708352
export const POSITIVE_DECIMAL_REGEX = /^([\d]+(?:[\.][\d]*)?|\.[\d]+)$/;

export const INTEGER_REGEX = /^[0-9]\d*$/;

export function parseNumber(str: string): number | undefined {
  const num = Number.parseFloat(str);
  return Number.isNaN(num) ? undefined : num;
}

export function getInitialCardinality(
  field: CoordinateField,
  coords?: Coordinates,
) {
  if (field === 'lat') {
    if (typeof coords?.lat !== 'number') {
      return 'N';
    }
    return coords.lat >= 0 ? 'N' : 'S';
  } else {
    if (typeof coords?.lon !== 'number') {
      return 'E';
    }
    return coords.lon >= 0 ? 'E' : 'W';
  }
}

export function latitudeIsValid(value: number) {
  return Math.abs(value) <= 90;
}

export function longitudeIsValid(value: number) {
  return Math.abs(value) <= 180;
}
