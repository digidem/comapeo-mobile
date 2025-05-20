import * as v from 'valibot';

import type {PhotoEXIF} from '../sharedTypes';

export const PhotoEXIFSchema = v.object({
  ApertureValue: v.optional(v.number()),
  DateTime: v.optional(v.string()),
  ExposureTime: v.optional(v.number()),
  Flash: v.optional(v.number()),
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
