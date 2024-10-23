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

const UnsavedAudioThumbnail: FC<{
  audio: UnsavedAudio;
  style?: StyleProp<ViewStyle>;
  size: number;
  isEditing: boolean;
}> = ({audio, style, size, isEditing}) => {
  const navigation = useNavigationFromRoot();

  const handlePress = () => {
    navigation.navigate('Audio', {
      existingUri: audio.uri,
      isEditing,
    });
  };
  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={handlePress}>
      <PlayArrow width={48} height={48} />
    </TouchableOpacity>
  );
};

const SavedAudioThumbnail: FC<{
  audio: AudioAttachment;
  style?: StyleProp<ViewStyle>;
  size: number;
  isEditing: boolean;
}> = ({audio, style, size, isEditing}) => {
  const {data, isPending, isError} = useAttachmentUrlQuery(audio, 'original');
  const navigation = useNavigationFromRoot();

  const handlePress = () => {
    if (!isPending && data?.url) {
      navigation.navigate('Audio', {
        existingUri: data.url,
        isEditing,
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={handlePress}
      disabled={isPending || !data?.url || isError}>
      <PlayArrow width={48} height={48} />
    </TouchableOpacity>
  );
};

export const AudioThumbnail: FC<AudioThumbnailProps> = ({
  audioAttachment,
  style,
  size = 80,
  isEditing = false,
}) => {
  if ('uri' in audioAttachment) {
    return (
      <UnsavedAudioThumbnail
        audio={audioAttachment}
        style={style}
        size={size}
        isEditing={isEditing}
      />
    );
  }
  return (
    <SavedAudioThumbnail
      audio={audioAttachment}
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
