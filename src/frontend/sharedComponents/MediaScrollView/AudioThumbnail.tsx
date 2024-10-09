import React, {FC, useMemo} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  View,
} from 'react-native';
import {BLACK, NEW_DARK_GREY, VERY_LIGHT_GREY, WHITE} from '../../lib/styles';
import PlayArrow from '../../images/PlayArrow.svg';
import {FormattedRelativeTime} from 'react-intl';
import {Duration} from 'luxon';

interface Recording {
  createdAt: number;
  duration: number;
}
interface AudioThumbnail {
  onPress: () => unknown;
  size: number;
  recording: Recording;
  style?: StyleProp<ViewStyle>;
}

export const AudioThumbnail: FC<AudioThumbnail> = ({
  onPress,
  recording,
  size,
  style,
}) => {
  const relativeTime = useMemo(
    () => Math.round((Date.now() - recording.createdAt) / 1000),
    [recording.createdAt],
  );

  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={onPress}>
      <View>
        <PlayArrow width={48} height={48} />
      </View>
      <Text style={styles.duration}>
        {Duration.fromMillis(recording.duration).toFormat('mm:ss')}
      </Text>
      <Text style={styles.timeSince}>
        <FormattedRelativeTime
          value={-relativeTime}
          numeric="auto"
          updateIntervalInSeconds={60}
        />
      </Text>
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
    padding: 10,
  },
  duration: {
    fontSize: 14,
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
