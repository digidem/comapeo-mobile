import * as v from 'valibot';

import type {PhotoEXIF} from '../sharedTypes';

export const PhotoEXIFSchema = v.object({
  ApertureValue: v.optional(v.number()),
  ExposureTime: v.optional(v.number()),
  Flash: v.optional(v.number()),
  FocalLength: v.optional(v.number()),
  FNumber: v.optional(v.number()),
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
