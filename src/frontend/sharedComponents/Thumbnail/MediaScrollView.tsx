import React, {FC} from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';

import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {PhotoThumbnail} from './PhotoThumbnail';
import {AudioThumbnail} from './AudioThumbnail';
// import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';

const spacing = 10;
const minSize = 150;

interface MediaScrollView {
  photos: (Partial<Photo> | undefined)[];
  audioRecordings: any[];
  observationId?: string;
}

export const MediaScrollView: FC<MediaScrollView> = props => {
  const {photos, audioRecordings = []} = props;
  // const navigation = useNavigationFromHomeTabs();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const length =
    props?.photos?.length ?? 0 + props?.audioRecordings?.length ?? 0;

  React.useLayoutEffect(() => {
    scrollViewRef.current && scrollViewRef.current.scrollToEnd();
  }, [photos?.length]);

  function handlePhotoPress(photoIndex: number) {
    // navigation.navigate('PhotosModal', {
    //   photoIndex: photoIndex,
    //   observationId: observationId,
    //   editing: true,
    // });
    return;
  }

  if (photos?.length === 0) return null;
  const windowWidth = Dimensions.get('window').width;
  // Get a thumbnail size so there is always 1/2 of a thumbnail off the right of
  // the screen.
  const size =
    windowWidth / (Math.round(0.6 + windowWidth / minSize) - 0.5) - spacing;

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      scrollEnabled={size * length > windowWidth}
      showsHorizontalScrollIndicator={false}
      contentInset={{top: 5, right: 5, bottom: 5, left: 5}}
      style={styles.photosContainer}>
      {audioRecordings.map(record => (
        <AudioThumbnail
          record={record}
          size={size}
          onPress={() => {}}
          style={styles.thumbnail}
        />
      ))}
      {photos
        ?.filter(photo => photo?.deleted == null)
        ?.map((photo, index) => (
          <PhotoThumbnail
            key={index}
            photo={photo}
            style={styles.thumbnail}
            size={size}
            onPress={() => photo && handlePhotoPress(photos.indexOf(photo))}
          />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  photosContainer: {
    margin: 10,
  },
  thumbnail: {
    marginHorizontal: 5,
  },
});
