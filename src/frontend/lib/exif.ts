import * as v from 'valibot';
import type {LocationObject} from 'expo-location';

import type {PhotoEXIF} from '../sharedTypes';

export type PhotoLayout = 'horizontal' | 'vertical';

export const PhotoEXIFSchema = v.object({
  ApertureValue: v.optional(v.number()),
  DateTime: v.optional(v.string()),
  ExposureTime: v.optional(v.number()),
  Flash: v.optional(v.number()),
  // @ts-expect-error Need changes to schema to fix
  FNumber: v.optional(v.number()),
  FocalLength: v.optional(v.number()),
  GPSAltitude: v.optional(v.number()),
  GPSAltitudeRef: v.optional(v.number()),
  GPSDateStamp: v.optional(v.string()),
  GPSLatitude: v.optional(v.number()),
  GPSLatitudeRef: v.optional(v.string()),
  GPSLongitude: v.optional(v.number()),
  GPSLongitudeRef: v.optional(v.string()),
  GPSTimeStamp: v.optional(v.string()),
  ISOSpeedRatings: v.optional(v.number()),
  ImageLength: v.optional(v.number()),
  ImageWidth: v.optional(v.number()),
  Make: v.optional(v.string()),
  Model: v.optional(v.string()),
  Orientation: v.optional(v.number()),
  ShutterSpeedValue: v.optional(v.number()),
} satisfies Required<{
  [field in keyof PhotoEXIF]: v.GenericSchema<PhotoEXIF[field]>;
}>) satisfies v.GenericSchema<PhotoEXIF>;

type GPSEXIFTags = {
  [key in Extract<keyof PhotoEXIF, `GPS${string}`>]?: PhotoEXIF[key];
};

/**
 * Calculates GPS-related EXIF tags based on a location object.
 * See https://exiftool.org/TagNames/GPS.html for reference.
 *
 * @param location Location object (from `expo-location`)
 */
export function locationToEXIF(location: LocationObject): GPSEXIFTags {
  const timestampDate = new Date(location.timestamp);

  return {
    GPSLongitude: location.coords.longitude,
    GPSLongitudeRef: location.coords.longitude >= 0 ? 'E' : 'W',
    GPSLatitude: location.coords.latitude,
    GPSLatitudeRef: location.coords.latitude >= 0 ? 'N' : 'S',
    GPSAltitude:
      typeof location.coords.altitude === 'number'
        ? location.coords.altitude
        : undefined,
    // `LocationObject.coords.altitude` is "altitude in meters above the WGS 84 reference ellipsoid." (https://docs.expo.dev/versions/latest/sdk/location/#locationobjectcoords),
    // which - from my understanding - translates to ""altitude in meters above sea level".
    // `0` is used by the EXIF spec to indicate that the `GPSAltitude` measurement is "above sea level".
    GPSAltitudeRef:
      typeof location.coords.altitude === 'number' ? 0 : undefined,
    GPSDateStamp: dateToGPSDateStamp(timestampDate),
    GPSTimeStamp: dateToGPSTimeStamp(timestampDate),
  };
}

/**
 * Convert a JS date to the GPSDateStamp EXIF tag. It is formatted as a UTC-adjusted `YYYY:MM:DD`.
 * See https://exiftool.org/TagNames/GPS.html for reference.
 *
 * @param d Date object
 */
function dateToGPSDateStamp(d: Date): string {
  const year = `${d.getUTCFullYear()}`;
  const month = `${d.getUTCMonth() + 1}`.padStart(2, '0');
  const date = `${d.getUTCDate()}`.padStart(2, '0');

  return `${year}:${month}:${date}`;
}

/**
 * Convert a JS date to the GPSTimeStamp EXIF tag. It is formatted as a UTC-adjusted `HH:MM:SS`.
 * See https://exiftool.org/TagNames/GPS.html for reference.
 *
 * @param d Date object
 */
function dateToGPSTimeStamp(d: Date): string {
  const hours = `${d.getUTCHours()}`.padStart(2, '0');
  const minutes = `${d.getUTCMinutes()}`.padStart(2, '0');
  const seconds = `${d.getUTCSeconds()}`;

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Describes the layout of the photo based on its EXIF orientation tag value.
 *
 * @param exifOrientation Value of EXIF orientation tag
 * @returns The layout
 */
export function getPhotoLayout(exifOrientation: number): PhotoLayout {
  // See "Orientation" tag in https://exiftool.org/TagNames/EXIF.html
  // Helpful explainer: https://www.ameto.de/blog/exif-orientation-primer/

  switch (exifOrientation) {
    case 1:
    case 2:
    case 3:
    case 4: {
      return 'horizontal';
    }
    case 5:
    case 6:
    case 7:
    case 8: {
      return 'vertical';
    }
    default: {
      throw new Error(`Invalid orientation value: ${exifOrientation}`);
    }
  }
}
