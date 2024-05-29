import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {BLACK, NEW_DARK_GREY, VERY_LIGHT_GREY, WHITE} from '../../lib/styles';
import Play from '../../images/observationEdit/Play.svg';
import {FormattedRelativeTime} from 'react-intl';
import {Duration} from 'luxon';
import {AudioRecording} from '../../sharedTypes/audio.ts';
import * as Progress from 'react-native-progress';

interface AudioThumbnail {
  onPress: () => unknown;
  size: number;
  recording?: AudioRecording;
  style?: StyleProp<ViewStyle>;
}

export const AudioThumbnail: FC<AudioThumbnail> = ({
  onPress,
  recording,
  size,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={onPress}>
      {recording ? (
        <>
          <Play />
          <Text style={styles.duration}>
            {Duration.fromMillis(recording.duration).toFormat('mm:ss')}
          </Text>
          <Text style={styles.timeSince}>
            <FormattedRelativeTime
              value={
                (new Date(recording.createdAt).getTime() - Date.now()) / 1000
              }
              numeric="auto"
              updateIntervalInSeconds={1}
            />
          </Text>
        </>
      ) : (
        <Progress.Circle size={30} indeterminate={true} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  thumbnailContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    borderColor: VERY_LIGHT_GREY,
    borderWidth: 1,
    overflow: 'hidden',
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Rubik',
    color: BLACK,
  },
  timeSince: {
    color: NEW_DARK_GREY,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Rubik',
  },
});
