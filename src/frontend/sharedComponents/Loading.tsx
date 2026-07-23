import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {ViewStyleProp} from '../sharedTypes';
import {LoadingIndicator} from './LoadingIndicator';

export const Loading = ({
  color,
  size,
  style,
}: {
  color?: string;
  size?: 'small' | 'large';
  style?: ViewStyleProp;
}) => (
  <View style={[styles.root, style]}>
    <LoadingIndicator color={color} size={size} />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
