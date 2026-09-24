import React from 'react';
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {WHITE} from '../../../lib/styles';
import {TrackSheetContent} from './TrackSheetContent';

const ANIMATION_DURATION = 250;

export const TrackBottomSheet = React.memo(({isOpen}: {isOpen: boolean}) => {
  const {height} = useWindowDimensions();

  const isE2E = process.env.EXPO_PUBLIC_E2E_TEST === 'true';

  const measuredHeight = React.useRef(height);
  // translateY moves the object down and the sheet is pinned to the bottom of the screen
  // By setting the initial value to the height of the screen, it will be moved completely off the screen
  // This means that it is NOT shown at first, which is desired
  const translateY = useSharedValue(height);

  React.useEffect(() => {
    translateY.value = withTiming(isOpen ? 0 : measuredHeight.current, {
      duration: ANIMATION_DURATION,
    });
  }, [isOpen, translateY]);

  const onLayoutSheet = (event: LayoutChangeEvent) => {
    measuredHeight.current = event.nativeEvent.layout.height;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  if (isE2E) {
    if (!isOpen) {
      return null;
    }
    return (
      <View style={styles.container}>
        <View style={styles.animatedBackground}>
          <TrackSheetContent isOpen={isOpen} />
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.animatedBackground, animatedStyle]}
      onLayout={onLayoutSheet}
      pointerEvents={isOpen ? 'auto' : 'none'}>
      <TrackSheetContent isOpen={isOpen} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  animatedBackground: {
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: '100%',
    minHeight: 140,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
});
