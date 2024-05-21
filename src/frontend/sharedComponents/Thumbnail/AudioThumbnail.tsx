import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';

interface AudioThumbnail {
  onPress: () => unknown;
  size?: number;
}

export const AudioThumbnail: FC<AudioThumbnail> = ({onPress, size}) => {
  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}]}
      onPress={onPress}></TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  thumbnailContainer: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
    overflow: 'hidden',
  },
});
