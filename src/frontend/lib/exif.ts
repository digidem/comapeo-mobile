import * as v from 'valibot';

import type {PhotoEXIF} from '../sharedTypes';

export type PhotoLayout = 'horizontal' | 'vertical';

export const PhotoEXIFSchema = v.object({
  ApertureValue: v.optional(v.number()),
  ExposureTime: v.optional(v.number()),
  Flash: v.optional(v.number()),
  FNumber: v.optional(v.number()),
  FocalLength: v.optional(v.number()),
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
