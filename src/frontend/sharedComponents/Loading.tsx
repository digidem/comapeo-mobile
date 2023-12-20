import * as React from 'react';
import {View, StyleSheet, Easing} from 'react-native';
import {DotIndicator, UIActivityIndicator} from 'react-native-indicators';
import {ViewStyleProp} from '../sharedTypes';

export const Loading = ({
  color,
  size,
  style,
  variant = 'dot',
}: {
  color?: string;
  size?: number;
  style?: ViewStyleProp;
  variant?: 'dot' | 'spinner';
}) => (
  <View style={[styles.root, style, variant === 'dot' ? {flex: 1} : {}]}>
    {variant === 'spinner' ? (
      <UIActivityIndicator color={color} animationDuration={1500} size={size} />
    ) : (
      <DotIndicator
        color={color}
        count={3}
        animationDuration={1500}
        size={size || 10}
        animationEasing={Easing.ease}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
