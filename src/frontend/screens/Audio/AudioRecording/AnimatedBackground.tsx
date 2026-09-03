import {StyleSheet, useWindowDimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MAX_RECORDING_DURATION_MS} from '../shared';
import {COMAPEO_BLUE} from '../../../lib/styles';

export function AnimatedBackground({timeElapsed}: {timeElapsed: number}) {
  const {bottom} = useSafeAreaInsets();
  const {height} = useWindowDimensions();
  const targetHeight = height - bottom;

  const elapsedTimeValue = useDerivedValue(() => {
    return withTiming(timeElapsed, {duration: 500});
  }, [timeElapsed]);

  const animatedStyles = useAnimatedStyle(() => ({
    height:
      targetHeight * (elapsedTimeValue.value * (1 / MAX_RECORDING_DURATION_MS)),
    backgroundColor: COMAPEO_BLUE,
  }));

  return <Animated.View style={[styles.fill, animatedStyles]} />;
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
