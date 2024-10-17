import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  View,
} from 'react-native';
import {BLACK, NEW_DARK_GREY, VERY_LIGHT_GREY, WHITE} from '../../lib/styles';
import PlayArrow from '../../images/PlayArrow.svg';

interface AudioThumbnail {
  onPress: () => unknown;
  size: number;
  style?: StyleProp<ViewStyle>;
}

export const AudioThumbnail: FC<AudioThumbnail> = ({onPress, size, style}) => {
  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}, style]}
      onPress={onPress}>
      <PlayArrow width={48} height={48} />
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
});
