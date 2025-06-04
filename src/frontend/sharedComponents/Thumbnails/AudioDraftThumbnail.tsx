import React from 'react';
import {StyleSheet} from 'react-native';
import PlayArrow from '../../images/PlayArrow.svg';
import {ThumbnailContainer} from './ThumbnailContainer';
import {UnsavedAudio} from '../../sharedTypes/audio';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import {BodyText} from '../Text/BodyText';
import {COMAPEO_BLUE, DARK_GREY, WHITE} from '../../lib/styles';
import {DateDistance} from '../DateDistance';

type Props = {
  size: number;
  audio: UnsavedAudio;
};

export const AudioDraftThumbnail = ({audio, size}: Props) => {
  const {navigate} = useNavigationFromRoot();

  return (
    <ThumbnailContainer
      size={size}
      onPress={() =>
        navigate('AudioDraftPlaybackScreen', {
          uri: audio.uri,
          createdAt: audio.createdAt,
          fromEditorPreview: true,
        })
      }
      containerStyle={styles.container}
      accessibilityLabel="Play audio recording.">
      <PlayArrow width={48} height={48} />
      <BodyText variant="tinyMeta" style={styles.durationText}>
        {millisecondsToMMSS(audio.duration)}
      </BodyText>

      <DateDistance
        date={new Date(audio.createdAt)}
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
    paddingVertical: 8,
  },
  durationText: {
    fontWeight: '500',
  },
});
