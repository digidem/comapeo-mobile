import * as React from 'react';
import Animated, {interpolate} from 'react-native-reanimated';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';

import {BLACK} from '../../lib/styles';

export const Backdrop = ({
  animatedIndex,
  style,
  ...rest
}: BottomSheetBackdropProps) => {
  const animatedOpacity = React.useMemo(
    () => interpolate(animatedIndex.value, [0, 1], [0, 0.3]),
    [animatedIndex],
  );

  const containerStyle = React.useMemo(
    () => [
      style,
      {
        backgroundColor: BLACK,
        opacity: animatedOpacity,
      },
    ],
    [style, animatedOpacity],
  );

  return <Animated.View {...rest} style={containerStyle} />;
};
