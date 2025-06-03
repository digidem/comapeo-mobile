import React from 'react';
import {StyleSheet} from 'react-native';
import PlayArrow from '../../images/PlayArrow.svg';
import {ThumbnailContainer} from './ThumbnailContainer';
import {AudioAttachment} from '../../sharedTypes/audio';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {FormattedObservationDate} from '../FormattedData';
import {BodyText} from '../Text/BodyText';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';
import {COMAPEO_BLUE, WHITE} from '../../lib/styles';

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
          createdAt: observation.createdAt,
        })
      }
      containerStyle={styles.container}
      accessibilityLabel="Play audio recording.">
      <PlayArrow width={48} height={48} />
      <BodyText variant="tinyMeta">
        <FormattedObservationDate
          createdDate={observation.createdAt}
          variant="long"
        />
      </BodyText>
    </ThumbnailContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    borderColor: COMAPEO_BLUE,
    borderWidth: 2,
    paddingVertical: 12,
  },
});
