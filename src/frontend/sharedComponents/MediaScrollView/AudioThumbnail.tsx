import React, {FC} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import PlayArrow from '../../images/PlayArrow.svg';
import {Audio} from '../../sharedTypes/audio';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {UIActivityIndicator} from 'react-native-indicators';
import {
  isAudioAttachment,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';
import {BLACK} from '../../lib/styles';

type AudioThumbnailProps = {
  audioAttachment: Audio;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

export const AudioThumbnail: FC<AudioThumbnailProps> = ({
  audioAttachment,
  style,
  size = 80,
}) => {
  const navigation = useNavigationFromRoot();
  const navState = navigation.getState();
  const curentRoute = navState.routes[navState.index];
  const {projectApi} = useActiveProject();
  const [loading, setLoading] = React.useState(false);

  if ('deleted' in audioAttachment && audioAttachment.deleted === true) {
    return null;
  }

  const handlePress = async () => {
    setLoading(true);
    let uri: string | undefined;
    const isSavedUri = isAudioAttachment(audioAttachment);

    if (isUnsavedAudio(audioAttachment)) {
      uri = audioAttachment.uri;
    } else {
      uri = await projectApi.$blobs.getUrl({
        driveId: audioAttachment.driveDiscoveryId,
        name: audioAttachment.name,
        type: audioAttachment.type,
        variant: 'original',
      });
    }
    setLoading(false);
    navigation.navigate('Audio', {
      isEditing: curentRoute?.name === 'ObservationEdit',
      uri,
      isSavedUri,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={handlePress}>
      {loading ? (
        <UIActivityIndicator color={BLACK} />
      ) : (
        <PlayArrow width={48} height={48} />
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
