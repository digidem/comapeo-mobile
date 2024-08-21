import React, {FC, createContext, useContext} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageErrorEventData,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {AlertIcon} from '../icons';
import debug from 'debug';
import {LIGHT_GREY} from '../../lib/styles';
import {
  DraftPhoto,
  Photo,
  SavedPhoto,
} from '../../contexts/PhotoPromiseContext/types';
import {useAttachmentUrlQuery} from '../../hooks/server/media';

// const log = debug('Thumbnail');

type PhotoThumbnailProps = PhotoThumbnailContextProps & {
  photo: Photo;
};

export const PhotoThumbnail: FC<PhotoThumbnailProps> = props => {
  const {photo, style, size, onPress} = props;

  return (
    <PhotoThumbnailContext.Provider value={{style, size, onPress}}>
      {photo.type === 'photo' ? (
        <SavedPhotoThumbnail photo={photo} />
      ) : (
        <UnsavedPhotoThumbnail photo={photo} />
      )}
    </PhotoThumbnailContext.Provider>
  );
};

type PhotoThumbnailImageProps = {
  isLoading: boolean;
  error?: Error | null;
  uri?: string;
};

const PhotoThumbnailImage = ({
  isLoading,
  error,
  uri,
}: PhotoThumbnailImageProps) => {
  console.log('PhotoThumbnailImage - URI:', uri);
  console.log('PhotoThumbnailImage - Error:', error);
  console.log('PhotoThumbnailImage - Is Loading:', isLoading);
  const [nativeImageError, setNativeImageError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const {size, style, onPress} = usePhotoThumbnailContext();

  function handleImageError(e: NativeSyntheticEvent<ImageErrorEventData>) {
    console.log('Error loading image:', e.nativeEvent.error);
    console.log('Error event:', e.nativeEvent); // Log the entire event
    console.log('URI that caused the error:', uri); // Log the URI that failed
    setNativeImageError(true);
    console.log('RETRY COUNT:', retryCount);
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
      setNativeImageError(false);
    } else {
      console.log('Max retries reached, showing error.');
    }
  }

  React.useEffect(() => {
    if (retryCount > 0 && retryCount <= maxRetries) {
      const timeout = setTimeout(() => setNativeImageError(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [retryCount]);

  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      disabled={isLoading || !!error || !onPress}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator />
      ) : error || nativeImageError || !uri ? (
        <AlertIcon />
      ) : (
        <Image
          onError={handleImageError}
          source={{uri}}
          style={{width: size, height: size}}
        />
      )}
    </TouchableOpacity>
  );
};

const SavedPhotoThumbnail = ({photo}: {photo: SavedPhoto}) => {
  const image = useAttachmentUrlQuery(photo, 'thumbnail');
  if (image.error) {
    console.log('Error loading image:\n', image.error);
  }
  return (
    <PhotoThumbnailImage
      isLoading={image.isPending}
      error={image.error}
      uri={image.data?.url}
    />
  );
};

const UnsavedPhotoThumbnail = ({photo}: {photo: DraftPhoto}) => {
  return (
    <PhotoThumbnailImage
      isLoading={photo.type === 'unprocessed' && !('error' in photo)}
      error={'error' in photo ? photo.error : undefined}
      uri={'thumbnailUri' in photo ? photo.thumbnailUri : undefined}
    />
  );
};

type PhotoThumbnailContextProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

const PhotoThumbnailContext = createContext<
  PhotoThumbnailContextProps | undefined
>(undefined);

function usePhotoThumbnailContext() {
  const context = useContext(PhotoThumbnailContext);

  if (!context) throw new Error('PhotoThumbnailContext not initialized');

  return context;
}

const styles = StyleSheet.create({
  thumbnailContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
    overflow: 'hidden',
  },
});
