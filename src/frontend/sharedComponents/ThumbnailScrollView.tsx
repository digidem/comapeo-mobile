import React from 'react';
import {
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ImageErrorEventData,
  NativeSyntheticEvent,
} from 'react-native';
import debug from 'debug';

import {LIGHT_GREY} from '../lib/styles';
import {AlertIcon} from './icons';
import {Photo} from '../contexts/PhotoPromiseContext/types';
import {usePersistedDraftObservation} from '../hooks/persistedState/usePersistedDraftObservation';

const spacing = 10;
const minSize = 150;
const log = debug('Thumbnail');

type ThumbnailProps = {
  photo: Photo;
  onPress: () => any;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

export const Thumbnail = ({photo, style, size, onPress}: ThumbnailProps) => {
  const [error, setError] = React.useState(false);

  const uri = 'thumbnailUri' in photo ? photo.thumbnailUri : undefined;

  function handleImageError(e: NativeSyntheticEvent<ImageErrorEventData>) {
    log('Error loading image:\n', e.nativeEvent && e.nativeEvent.error);
    setError(true);
  }

  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={onPress}>
      {'capturing' in photo && photo.capturing === true && !error ? (
        <ActivityIndicator />
      ) : error || typeof uri !== 'string' ? (
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

export const ThumbnailScrollView = (props: {photos: Photo[]}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const {photos} = props;

  React.useLayoutEffect(() => {
    scrollViewRef.current && scrollViewRef.current.scrollToEnd();
  }, [photos.length]);

  function handlePhotoPress(photoIndex: number) {
    // navigation.navigate('PhotosModal', {
    //   photoIndex: photoIndex,
    //   observationId: observationId,
    //   editing: true,
    // });
    return;
  }

  if (photos.length === 0) return null;
  const windowWidth = Dimensions.get('window').width;
  // Get a thumbnail size so there is always 1/2 of a thumbnail off the right of
  // the screen.
  const size =
    windowWidth / (Math.round(0.6 + windowWidth / minSize) - 0.5) - spacing;

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={true}
      contentInset={{top: 5, right: 5, bottom: 5, left: 5}}
      style={styles.photosContainer}>
      {photos
        .filter(photo => photo.deleted == null)
        .map((photo, index) => (
          <Thumbnail
            key={index}
            photo={photo}
            style={styles.thumbnail}
            size={size}
            onPress={() => handlePhotoPress(photos.indexOf(photo))}
          />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  photosContainer: {
    flex: 1,
  },
  thumbnail: {
    margin: 5,
  },
  thumbnailContainer: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
    overflow: 'hidden',
  },
});
