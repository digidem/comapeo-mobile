import React, {FC} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import PlayArrow from '../../images/PlayArrow.svg';
import {Audio} from '../../sharedTypes/audio';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {UIActivityIndicator} from 'react-native-indicators';
import {isUnsavedAudio} from '../../lib/attachmentTypeChecks';
import {BLACK} from '../../lib/styles';
import {useNavigationState} from '@react-navigation/native';

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
  const routes = useNavigationState(state => state.routes);
  const navIndex = useNavigationState(state => state.index);
  const currentRoute = routes[navIndex];
  const {projectApi} = useActiveProject();
  const [loading, setLoading] = React.useState(false);

  if ('deleted' in audioAttachment && audioAttachment.deleted === true) {
    return null;
  }

  const handlePress = async () => {
    if (isUnsavedAudio(audioAttachment)) {
      navigation.navigate('AudioPlaybackUnsavedPreview', {
        uri: audioAttachment.uri,
      });
      return;
    }

    setLoading(true);
    const uri = await projectApi.$blobs.getUrl({
      driveId: audioAttachment.driveDiscoveryId,
      name: audioAttachment.name,
      type: audioAttachment.type,
      variant: 'original',
    });
    setLoading(false);
    navigation.navigate('AudioPlaybackSaved', {
      uri,
      // this should be derived from the parent component and not be reliant on navigation context. TO DO when observations is refactored
      canDelete: currentRoute?.name === 'ObservationEdit',
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
