import React, {FC} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import PlayArrow from '../../images/PlayArrow.svg';
import {AudioAttachment, UnsavedAudio, Audio} from '../../sharedTypes/audio';
import {useAttachmentUrlQuery} from '../../hooks/server/media';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

type AudioThumbnailProps = {
  audioAttachment: Audio;
  style?: StyleProp<ViewStyle>;
  size?: number;
  isEditing: boolean;
};

interface SharedThumbnailProps {
  style?: StyleProp<ViewStyle>;
  size: number;
  isEditing: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

const AudioThumbnailButton: FC<SharedThumbnailProps> = ({
  style,
  size,
  onPress,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[styles.thumbnailContainer, {width: size, height: size}, style]}
    disabled={disabled}
    onPress={onPress}>
    <PlayArrow width={48} height={48} />
  </TouchableOpacity>
);

const UnsavedAudioThumbnail: FC<
  SharedThumbnailProps & {audioAttachment: UnsavedAudio}
> = ({audioAttachment, ...props}) => {
  const navigation = useNavigationFromRoot();

  const handlePress = () => {
    navigation.navigate('Audio', {
      existingUri: audioAttachment.uri,
      isEditing: props.isEditing,
    });
  };

  return <AudioThumbnailButton {...props} onPress={handlePress} />;
};

const SavedAudioThumbnail: FC<
  SharedThumbnailProps & {audioAttachment: AudioAttachment}
> = ({audioAttachment, ...props}) => {
  const {data, isPending, isError} = useAttachmentUrlQuery(
    audioAttachment,
    'original',
  );
  const navigation = useNavigationFromRoot();

  const handlePress = () => {
    if (!isPending && data?.url) {
      navigation.navigate('Audio', {
        existingUri: data.url,
        isEditing: props.isEditing,
      });
    }
  };

  return (
    <AudioThumbnailButton
      {...props}
      onPress={handlePress}
      disabled={isPending || !data?.url || isError}
    />
  );
};

export const AudioThumbnail: FC<AudioThumbnailProps> = ({
  audioAttachment,
  style,
  size = 80,
  isEditing = false,
}) => {
  if ('deleted' in audioAttachment && audioAttachment.deleted === true) {
    return null;
  }
  if ('uri' in audioAttachment) {
    return (
      <UnsavedAudioThumbnail
        audioAttachment={audioAttachment}
        style={style}
        size={size}
        isEditing={isEditing}
      />
    );
  }
  return (
    <SavedAudioThumbnail
      audioAttachment={audioAttachment}
      style={style}
      size={size}
      isEditing={isEditing}
    />
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
