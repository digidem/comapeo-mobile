import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';
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
    createdAt: photo.createdAt
      ? new Date(photo.createdAt).getTime()
      : undefined,
    coordinates:
      typeof photo.position?.coords.longitude === 'number' &&
      typeof photo.position?.coords.latitude === 'number'
        ? {
            longitude: photo.position.coords.longitude,
            latitude: photo.position.coords.latitude,
          }
        : undefined,
    external: photo.external,
  };
}

export function getDraftPhotoInfo({
  photoMetadata,
  photoExif,
}: {
  photoMetadata: PhotoMetadata;
  photoExif?: PhotoEXIF;
}): DisplayablePhotoInfo {
  const exifBasedInfo = photoExif ? extractInfoFromEXIF(photoExif) : undefined;

  return {
    ...exifBasedInfo,
    coordinates:
      typeof photoMetadata.location?.coords.longitude === 'number' &&
      typeof photoMetadata.location?.coords.latitude === 'number'
        ? {
            longitude: photoMetadata.location.coords.longitude,
            latitude: photoMetadata.location.coords.latitude,
          }
        : undefined,
    createdAt: photoMetadata.timestamp,
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
    fNumber: exif.FNumber,
    layout,
    make: exif.Make,
    model: exif.Model,
    height: exif.ImageLength,
    width: exif.ImageWidth,
  };
}
