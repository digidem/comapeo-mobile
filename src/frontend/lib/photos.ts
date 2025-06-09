import type {ProcessedDraftPhoto} from '../contexts/PhotoPromiseContext/types';
import type {Attachment, PhotoEXIF} from '../sharedTypes';
import {getPhotoLayout, type PhotoLayout} from './exif';

type DisplayablePhotoInfo = {
  coordinates?: {
    longitude: number;
    latitude: number;
  };
  createdAt?: number;
  external: boolean;

  fNumber?: number;
  height?: number;
  layout?: PhotoLayout;
  make?: string;
  model?: string;
  width?: number;
};

export function getAttachmentPhotoInfo(
  photo: Extract<Attachment, {type: 'photo'}>,
): DisplayablePhotoInfo {
  const {photoExif} = photo;

  const exifBasedInfo = photoExif ? extractInfoFromEXIF(photoExif) : undefined;

  return {
    ...exifBasedInfo,
    createdAt:
      // @ts-expect-error Updated core needed
      photo.createdAt
        ? new Date(
            // @ts-expect-error Updated core needed
            photo.createdAt,
          ).getTime()
        : undefined,
    coordinates:
      // @ts-expect-error Updated core needed
      typeof photo.position?.coords.longitude === 'number' &&
      // @ts-expect-error Updated core needed
      typeof photo.position?.coords.latitude === 'number'
        ? {
            // @ts-expect-error Updated core needed
            longitude: photo.position.coords.longitude,
            // @ts-expect-error Updated core needed
            latitude: photo.position.coords.latitude,
          }
        : undefined,
    external:
      // @ts-expect-error Updated core needed
      !!photo.external,
  };
}

export function getDraftPhotoInfo(
  photo: ProcessedDraftPhoto,
): DisplayablePhotoInfo {
  const {photoExif} = photo.mediaMetadata;

  const exifBasedInfo = photoExif ? extractInfoFromEXIF(photoExif) : undefined;

  return {
    ...exifBasedInfo,
    coordinates:
      typeof photo.mediaMetadata.location?.coords.longitude === 'number' &&
      typeof photo.mediaMetadata.location?.coords.latitude === 'number'
        ? {
            longitude: photo.mediaMetadata.location.coords.longitude,
            latitude: photo.mediaMetadata.location.coords.latitude,
          }
        : undefined,
    createdAt: photo.mediaMetadata.timestamp,
    external: false,
  };
}

function extractInfoFromEXIF(
  exif: PhotoEXIF,
): Pick<
  DisplayablePhotoInfo,
  'fNumber' | 'height' | 'layout' | 'make' | 'model' | 'width'
> {
  let layout: PhotoLayout | undefined = undefined;

  if (exif.Orientation) {
    try {
      layout = getPhotoLayout(exif.Orientation);
    } catch {
      // no-op
    }
  }

  return {
    // @ts-expect-error Updated core needed
    fNumber: exif.FNumber,
    layout,
    make: exif.Make,
    model: exif.Model,
    height: exif.ImageLength,
    width: exif.ImageWidth,
  };
}
