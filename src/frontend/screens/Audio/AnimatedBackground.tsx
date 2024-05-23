import React, {FC} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MAX_DURATION} from './AudioRecordingScreen';

interface AnimatedBackground {
  elapsedTimeValue: SharedValue<number>;
}

export const AnimatedBackground: FC<AnimatedBackground> = ({
  elapsedTimeValue,
}) => {
  const {top: topInset} = useSafeAreaInsets();
  const {height: windowHeight} = Dimensions.get('window');

  const animatedStyles = useAnimatedStyle(() => ({
    height:
      (windowHeight + topInset) * (elapsedTimeValue.value * (1 / MAX_DURATION)),
    backgroundColor: `hsl(216, 100%, ${elapsedTimeValue.value * (1 / MAX_DURATION) * 50}%)`,
  }));

  return <Animated.View style={[styles.fill, animatedStyles]} />;
};

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    zIndex: -1,
    bottom: 0,
    width: '100%',
  },
});
