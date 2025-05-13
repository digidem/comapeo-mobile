import React from 'react';
import {Image} from 'react-native';
import {AlertIcon} from '../icons';
import {SavedPhoto} from '../../contexts/PhotoPromiseContext/types';
import {useAttachmentUrlQuery} from '../../hooks/server/media';
import {ThumbnailContainer} from './ThumbnailContainer';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

export const ThumbnailImage = ({error, uri}: {error?: Error; uri: string}) => {
  const [nativeImageError, setNativeImageError] = React.useState(false);

  function handleImageError() {
    setNativeImageError(true);
  }

  if (error || nativeImageError) {
    return <AlertIcon />;
  }

  return (
    <Image
      onError={handleImageError}
      source={{uri}}
      style={{width: '100%', height: '100%'}}
    />
  );
};

export const SavedPhotoThumbnailImage = ({
  photo,
  size,
}: {
  photo: SavedPhoto;
  size: number;
}) => {
  const image = useAttachmentUrlQuery(photo, 'thumbnail');
  const navigation = useNavigationFromRoot();

  return (
    <ThumbnailContainer
      size={size}
      onPress={
        image.error
          ? undefined
          : () => {
              navigation.navigate('PhotoPreviewModal', {
                photo,
              });
            }
      }>
      <ThumbnailImage error={image.error || undefined} uri={image.url} />
    </ThumbnailContainer>
  );
};
