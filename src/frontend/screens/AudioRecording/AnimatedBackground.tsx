import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {MAX_RECORDING_DURATION_MS} from '../Audio/index';

export function AnimatedBackground({timeElapsed}: {timeElapsed: number}) {
  const {top} = useSafeAreaInsets();
  const {height} = Dimensions.get('window');

  const elapsedTimeValue = useDerivedValue(() => {
    return withTiming(timeElapsed, {duration: 500});
  }, [timeElapsed]);

  const animatedStyles = useAnimatedStyle(() => ({
    height:
      (height + top) *
      (elapsedTimeValue.value * (1 / MAX_RECORDING_DURATION_MS)),
    backgroundColor: `hsl(216, 100%, ${elapsedTimeValue.value * (1 / MAX_RECORDING_DURATION_MS) * 50}%)`,
  }));

  return <Animated.View style={[styles.fill, animatedStyles]} />;
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    zIndex: -1,
    bottom: 0,
    width: '100%',
  },
});
