import React, {FC} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import PlayArrow from '../../images/PlayArrow.svg';
import {Audio} from '../../sharedTypes/audio';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

type AudioThumbnailProps = {
  audioAttachment: Audio;
  style?: StyleProp<ViewStyle>;
  size?: number;
  isEditing: boolean;
};

export const AudioThumbnail: FC<AudioThumbnailProps> = ({
  audioAttachment,
  style,
  size = 80,
  isEditing = false,
}) => {
  const navigation = useNavigationFromRoot();
  const {actions} = usePersistedDraftObservation();

  if ('deleted' in audioAttachment && audioAttachment.deleted === true) {
    return null;
  }

  const handlePress = () => {
    actions.setSelectedAudioAttachment(audioAttachment);
    navigation.navigate('Audio', {
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

const styles = StyleSheet.create({
  thumbnailContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
    overflow: 'hidden',
  },
});
