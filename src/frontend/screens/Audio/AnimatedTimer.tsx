import React, {FC} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import Animated, {SharedValue, useAnimatedProps} from 'react-native-reanimated';
import {WHITE} from '../../lib/styles';

Animated.addWhitelistedNativeProps({text: true});
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedTimer {
  elapsedTime: SharedValue<number>;
}

export function convertMsToTime(ms: number) {
  'worklet';
  let minutes = Math.floor(ms / 60000);
  let seconds = Number(((ms % 60000) / 1000).toFixed(0));
  return (
    (minutes < 10 ? '0' : '') +
    minutes +
    ':' +
    (seconds < 10 ? '0' : '') +
    seconds
  );
}

export const AnimatedTimer: FC<AnimatedTimer> = ({elapsedTime}) => {
  const animatedProps = useAnimatedProps(() => {
    const currentValue = convertMsToTime(elapsedTime.value);
    return {text: currentValue, defaultValue: currentValue};
  }, [elapsedTime]);
  return (
    <AnimatedTextInput
      animatedProps={animatedProps}
      style={styles.timerStyle}
      editable={false}
      underlineColorAndroid="transparent"
    />
  );
};

const styles = StyleSheet.create({
  timerStyle: {
    fontFamily: 'Rubik',
    fontSize: 96,
    color: WHITE,
    marginTop: 'auto',
    textAlign: 'center',
    marginBottom: 120,
  },
});
