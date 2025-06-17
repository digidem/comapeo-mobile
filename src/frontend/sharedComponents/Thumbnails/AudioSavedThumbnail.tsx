import React from 'react';
import {StyleSheet} from 'react-native';
import PlayArrow from '../../images/PlayArrow.svg';
import {ThumbnailContainer} from './ThumbnailContainer';
import {AudioAttachment} from '../../sharedTypes/audio';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';
import {COMAPEO_BLUE, DARK_GREY, WHITE} from '../../lib/styles';
import {DateDistance} from '../DateDistance';

type Props = {
  size: number;
  audio: AudioAttachment;
  observationId: string;
};

export const AudioSavedThumbnail = ({audio, observationId, size}: Props) => {
  const {navigate} = useNavigationFromRoot();
  const {observation} = useObservationWithPreset(observationId);
  return (
    <ThumbnailContainer
      size={size}
      onPress={() =>
        navigate('AudioAttachmentPlaybackScreen', {
          driveDiscoveryId: audio.driveDiscoveryId,
          name: audio.name,
          type: audio.type,
          createdAt: audio.createdAt || observation.createdAt,
        })
      }
      containerStyle={styles.container}
      accessibilityLabel="Play audio recording.">
      <PlayArrow width={48} height={48} />
      <DateDistance
        date={new Date(audio.createdAt || observation.createdAt)}
        style={{fontSize: 12, fontWeight: 400, color: DARK_GREY}}
      />
    </ThumbnailContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    borderColor: COMAPEO_BLUE,
    borderWidth: 2,
    paddingVertical: 12,
    gap: 8,
  },
});
