import React, {FC} from 'react';
import {Photo} from '../../contexts/PhotoPromiseContext/types';
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

const log = debug('Thumbnail');

type PhotoThumbnailProps = {
  photo?: Partial<Photo>;
  onPress: () => any;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

export const PhotoThumbnail: FC<PhotoThumbnailProps> = props => {
  const {photo, style, size, onPress} = props;
  const [error, setError] = React.useState(false);

  const uri =
    (photo && 'thumbnailUri' in photo && photo.thumbnailUri) || undefined;
  const photoProcessingError = photo && 'error' in photo && !!photo.error;
  const isCapturing = photo && photo.type === 'unprocessed';

  function handleImageError(e: NativeSyntheticEvent<ImageErrorEventData>) {
    log('Error loading image:\n', e.nativeEvent && e.nativeEvent.error);
    setError(true);
  }

  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={onPress}>
      {error || photoProcessingError ? (
        <AlertIcon />
      ) : isCapturing ? (
        <ActivityIndicator />
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

const styles = StyleSheet.create({
  thumbnailContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
    overflow: 'hidden',
  },
});
