import React from 'react';

import {useBlobUrl} from '../../../hooks/server/media';
import {AlertIcon} from '../../icons';
import {Loading} from '../../Loading';
import {PressableThumbnailImage} from '../PressableThumbnailImage';
import {ThumbnailContainer} from '../ThumbnailContainer';

export function PhotoAttachment({
  name,
  driveId,
  onPress,
  size,
}: {
  name: string;
  driveId: string;
  onPress?: () => void;
  size: number;
}) {
  const blobUrlQuery = useBlobUrl({
    type: 'photo',
    driveId: driveId,
    name: name,
    variant: 'thumbnail',
  });

  if (blobUrlQuery.status === 'error') {
    return (
      <ThumbnailContainer size={size}>
        <AlertIcon size={size / 2} />
      </ThumbnailContainer>
    );
  }

  if (blobUrlQuery.status === 'pending') {
    return (
      <ThumbnailContainer loading size={size}>
        <Loading />
      </ThumbnailContainer>
    );
  }

  return (
    <PressableThumbnailImage
      url={blobUrlQuery.data}
      onPress={onPress}
      size={size}
    />
  );
}
