import React, {FC} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import PlayArrow from '../../images/PlayArrow.svg';
import {AudioAttachment, UnsavedAudio, Audio} from '../../sharedTypes/audio';
import {useAttachmentUrlQuery} from '../../hooks/server/media';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {AlertIcon} from '../icons';
import {UIActivityIndicator} from 'react-native-indicators';

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
  disabled?: boolean;
}

type AudioThumbnailImageProps = {
  isLoading: boolean;
  error?: Error | null;
  uri?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size: number;
};

const AudioThumbnailImage = ({
  isLoading,
  error,
  uri,
  onPress,
  style,
  size,
}: AudioThumbnailImageProps) => {
  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      disabled={isLoading || !!error || !onPress}
      onPress={onPress}>
      {isLoading ? (
        <UIActivityIndicator size={48} />
      ) : error || !uri ? (
        <AlertIcon />
      ) : (
        <PlayArrow width={48} height={48} />
      )}
    </TouchableOpacity>
  );
};

const UnsavedAudioThumbnail: FC<
  SharedThumbnailProps & {audioAttachment: UnsavedAudio}
> = ({audioAttachment, ...props}) => {
  const navigation = useNavigationFromRoot();

  const handlePress = () => {
    navigation.navigate('Audio', {
      uri: audioAttachment.uri,
      isEditing: props.isEditing,
    });
  };

  return (
    <AudioThumbnailImage
      isLoading={false}
      error={null}
      uri={audioAttachment.uri}
      onPress={handlePress}
      style={props.style}
      size={props.size}
    />
  );
};

const SavedAudioThumbnail: FC<
  SharedThumbnailProps & {audioAttachment: AudioAttachment}
> = ({audioAttachment, ...props}) => {
  const {data, isPending, error} = useAttachmentUrlQuery(
    audioAttachment,
    'original',
  );
  const navigation = useNavigationFromRoot();

  const handlePress = () => {
    if (!isPending && data?.url) {
      navigation.navigate('Audio', {
        uri: data.url,
        isEditing: props.isEditing,
      });
    }
  };

  return (
    <AudioThumbnailImage
      isLoading={isPending && !error}
      error={error}
      uri={data?.url}
      onPress={handlePress}
      style={props.style}
      size={props.size}
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
