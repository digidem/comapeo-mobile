import React, {FC} from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';

import {Photo} from '../../contexts/PhotoPromiseContext/types.ts';
import {AudioRecording} from '../../sharedTypes/index.ts';
import {PhotoThumbnail} from './PhotoThumbnail.tsx';
import {AudioThumbnail} from './AudioThumbnail.tsx';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';

const spacing = 10;
const minSize = 150;

interface MediaScrollView {
  photos: Photo[];
  audioRecordings?: AudioRecording[];
  observationId?: string;
}

export const MediaScrollView: FC<MediaScrollView> = ({
  photos,
  audioRecordings = [],
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const length = (photos?.length ?? 0) + (audioRecordings?.length ?? 0);
  const navigation = useNavigationFromRoot();

  React.useLayoutEffect(() => {
    scrollViewRef.current && scrollViewRef.current.scrollToEnd();
  }, [photos?.length]);

  if (length === 0) return null;

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
      style={styles.mediaContainer}>
      {photos
        ?.filter(photo => photo?.deleted == null)
        ?.map((photo, index) => {
          const onPress =
            photo.type === 'photo' || photo.type === 'processed'
              ? () => {
                  navigation.navigate('PhotoPreviewModal', {photo});
                }
              : undefined;
          return (
            <PhotoThumbnail
              key={index}
              photo={photo}
              style={styles.thumbnail}
              size={size}
              onPress={onPress}
            />
          );
        })}
      {audioRecordings?.map((recording, index) => {
        console.log('recording', recording);
        const onPress = () => {
          navigation.navigate('Audio', {
            existingUri: recording.uri,
          });
        };

        return (
          <AudioThumbnail
            key={`audio-${index}`}
            recording={{
              createdAt: recording.createdAt,
              duration: recording.duration,
            }}
            style={styles.thumbnail}
            size={size}
            onPress={onPress}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    margin: 10,
  },
  thumbnail: {
    marginHorizontal: 5,
  },
});
