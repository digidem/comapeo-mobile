import React, {FC} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {NEW_DARK_GREY, WHITE} from '../../lib/styles';

const {width} = Dimensions.get('window');

interface AnimatedProgressBar {
  isReady: boolean;
  elapsed: SharedValue<number>;
  duration: number;
}
export const AnimatedProgressBar: FC<AnimatedProgressBar> = ({
  isReady,
  elapsed,
  duration,
}) => {
  const animatedStyles = useAnimatedStyle(() => {
    const fillPercentage = isReady ? elapsed.value * (1 / duration) : 0;
    return {
      width: fillPercentage * (width - 60),
    };
  });
  return (
    <View style={styles.progressBarWrapper}>
      <View style={[styles.progressBar, {width: width - 60}]} />
      <Animated.View
        style={[styles.progressBar, styles.progressBarFill, animatedStyles]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarWrapper: {
    position: 'relative',
  },
  progressBar: {
    bottom: 82,
    marginLeft: 30,
    height: 4,
    backgroundColor: NEW_DARK_GREY,
    position: 'absolute',
  },
  progressBarFill: {
    backgroundColor: WHITE,
  },
});
