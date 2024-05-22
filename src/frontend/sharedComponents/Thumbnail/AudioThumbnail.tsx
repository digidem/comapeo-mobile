import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {BLACK, NEW_DARK_GREY, NEW_LIGHT_GREY, WHITE} from '../../lib/styles';
import Play from '../../images/observationEdit/Play.svg';
import {FormattedRelativeTime} from 'react-intl';
import {Duration} from 'luxon';

interface Record {
  createdAt: Date;
}
interface AudioThumbnail {
  onPress: () => unknown;
  size: number;
  record: Record;
  style?: StyleProp<ViewStyle>;
}

export const AudioThumbnail: FC<AudioThumbnail> = ({
  onPress,
  record,
  size,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={onPress}>
      <Play />
      <Text style={styles.duration}>
        {Duration.fromMillis(record.createdAt.getTime()).toFormat('mm:ss')}
      </Text>
      <Text style={styles.timeSince}>
        <FormattedRelativeTime
          value={(Date.now() - record.createdAt.getTime()) / 1000}
          numeric="auto"
          updateIntervalInSeconds={1}
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
    borderColor: NEW_LIGHT_GREY,
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
