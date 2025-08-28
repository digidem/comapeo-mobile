import {point} from '@turf/helpers';
import {distance} from '@turf/distance';
import type {PhotoLayout} from '../../lib/exif.ts';
import {bytesToMegabytes} from '../../lib/bytesToMegabytes.ts';
import {defineMessages, type IntlShape} from 'react-intl';
import {useCallback, useState} from 'react';
import {captureException} from '@sentry/react-native';
import type {ImageLoadEventData} from 'expo-image';
import {getExpoImageStorageSize} from '../../lib/file-system.ts';

const m = defineMessages({
  imageStorageSize: {
    id: 'screens.PhotoPreviewModal.imageStorageSize',
    defaultMessage: '{value} MB',
    description: 'Image size in megabytes',
  },
  landscape: {
    id: 'screens.PhotoPreviewModal.landscape',
    defaultMessage: 'Landscape',
    description: 'Describes image layout when taking photo horizontally',
  },
  portrait: {
    id: 'screens.PhotoPreviewModal.portrait',
    defaultMessage: 'Portrait',
    description: 'Describes image layout when taking photo vertically',
  },
});

export function calculateDistanceAsMeters({
  photoLocation,
  observationLocation,
}: {
  photoLocation: [number, number];
  observationLocation: [number, number];
}): number {
  const photoPoint = point(photoLocation);
  const observationPoint = point(observationLocation);
  return distance(photoPoint, observationPoint, {units: 'meters'});
}

export function calcPhotoTimeRelativeToObs({
  photoCreatedAt,
  observationCreatedAt,
}: {
  photoCreatedAt: number;
  observationCreatedAt: number;
}): number {
  const diffInMilliseconds = photoCreatedAt - observationCreatedAt;
  const min = diffInMilliseconds / 1000 / 60;
  return parseFloat(min.toFixed(2));
}

export function getDeviceDetailsText({
  make,
  model,
}: {
  make?: string;
  model?: string;
}) {
  const displayedParts: Array<string> = [];

  if (make) {
    displayedParts.push(make);
  }

  if (model) {
    displayedParts.push(model);
  }

  if (displayedParts.length === 0) {
    return null;
  }

  return displayedParts.join(' ');
}

export function getCameraDetailsText(
  {
    fNumber,
    layout,
  }: {
    fNumber?: number;
    layout?: PhotoLayout;
  },
  formatMessage: IntlShape['formatMessage'],
): string | null {
  const displayedParts: Array<string> = [];

  if (layout) {
    displayedParts.push(
      layout === 'horizontal'
        ? formatMessage(m.landscape)
        : formatMessage(m.portrait),
    );
  }

  if (typeof fNumber === 'number') {
    displayedParts.push(`𝒇 ${fNumber}`);
  }

  if (displayedParts.length === 0) {
    return null;
  }

  return displayedParts.join(' — ');
}

export function getPhotoDetailsText(
  {
    width,
    height,
    storageSize,
  }: {
    width: number;
    height: number;
    storageSize?: number;
  },
  formatMessage: IntlShape['formatMessage'],
): string | null {
  const displayedParts: Array<string> = [];

  // TODO: Should this be translated?
  displayedParts.push(`${width} x ${height}`);

  if (typeof storageSize === 'number') {
    displayedParts.push(
      formatMessage(m.imageStorageSize, {
        value: Math.max(bytesToMegabytes(storageSize), 0.01).toFixed(2),
      }),
    );
  }

  if (displayedParts.length === 0) {
    return null;
  }

  return displayedParts.join(' • ');
}

type getPhotoDimensionsProps = {
  photoInfoHeight?: number;
  photoInfoWidth?: number;
  imageLoadInfoHeight?: number;
  imageLoadInfoWidth?: number;
};

export function getPhotoDimensions({
  photoInfoHeight,
  photoInfoWidth,
  imageLoadInfoHeight,
  imageLoadInfoWidth,
}: getPhotoDimensionsProps): {height: number; width: number} | undefined {
  return typeof photoInfoHeight === 'number' &&
    typeof photoInfoWidth === 'number'
    ? {
        height: photoInfoHeight,
        width: photoInfoWidth,
      }
    : typeof imageLoadInfoHeight === 'number' &&
        typeof imageLoadInfoWidth === 'number'
      ? {
          height: imageLoadInfoHeight,
          width: imageLoadInfoWidth,
        }
      : undefined;
}

export function useImageLoadInfo() {
  const [imageLoadInfo, setImageLoadInfo] = useState<
    {height: number; width: number; storageSize?: number} | undefined
  >(undefined);

  const onImageLoad = useCallback(async (event: ImageLoadEventData) => {
    try {
      const storageSize = await getExpoImageStorageSize(event.source.url);

      setImageLoadInfo({
        height: event.source.height,
        width: event.source.width,
        storageSize,
      });
    } catch (err) {
      captureException(err);

      setImageLoadInfo({
        height: event.source.height,
        width: event.source.width,
      });
    }
  }, []);

  return {imageLoadInfo, onImageLoad};
}
