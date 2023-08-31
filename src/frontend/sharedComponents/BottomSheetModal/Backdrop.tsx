import * as React from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';

import {BLACK} from '../../lib/styles';

export const Backdrop = ({animatedIndex, style}: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  const containerStyle = React.useMemo(
    () => [
      style,
      {
        backgroundColor: '#a8b5eb',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return <Animated.View style={containerStyle} />;
};
