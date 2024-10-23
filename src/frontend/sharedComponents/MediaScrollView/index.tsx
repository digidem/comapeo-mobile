import React, {FC} from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';

import {Photo} from '../../contexts/PhotoPromiseContext/types.ts';
import {PhotoThumbnail} from './PhotoThumbnail.tsx';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import {AudioThumbnail} from './AudioThumbnail.tsx';
import {Audio, AudioAttachment, UnsavedAudio} from '../../sharedTypes/audio.ts';

const spacing = 10;
const minSize = 150;

interface MediaScrollView {
  attachments: (Audio | Photo)[];
  observationId?: string;
  isEditing?: boolean;
}

const isPhoto = (attachment: Audio | Photo): attachment is Photo => {
  return (
    'type' in attachment &&
    (attachment.type === 'photo' ||
      attachment.type === 'processed' ||
      attachment.type === 'unprocessed')
  );
};

const isAudioAttachment = (
  attachment: Audio | Photo,
): attachment is AudioAttachment => {
  return 'type' in attachment && attachment.type === 'audio';
};

const isUnsavedAudio = (
  attachment: Audio | Photo,
): attachment is UnsavedAudio => {
  return 'uri' in attachment && !('driveDiscoveryId' in attachment);
};

export const MediaScrollView: FC<MediaScrollView> = ({
  attachments,
  isEditing = false,
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const length = attachments.length;
  const navigation = useNavigationFromRoot();
  React.useLayoutEffect(() => {
    scrollViewRef.current && scrollViewRef.current.scrollToEnd();
  }, [attachments.length]);

  if (length === 0) return null;
  const windowWidth = Dimensions.get('window').width;
  // Get a thumbnail size so there is always 1/2 of a thumbnail off the right of
  // the screen.
  const size =
    windowWidth / (Math.round(0.6 + windowWidth / minSize) - 0.5) - spacing;

  const photos = attachments.filter(isPhoto);
  const audioAttachments = attachments.filter(
    (attachment): attachment is AudioAttachment | UnsavedAudio =>
      isAudioAttachment(attachment) || isUnsavedAudio(attachment),
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      scrollEnabled={size * length > windowWidth}
      showsHorizontalScrollIndicator={false}
      contentInset={{top: 5, right: 5, bottom: 5, left: 5}}
      style={styles.mediaContainer}>
      {audioAttachments.map((audio, index) => (
        <AudioThumbnail
          key={`audio-${index}`}
          audioAttachment={audio}
          style={styles.thumbnail}
          size={size}
          isEditing={isEditing}
        />
      ))}
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
