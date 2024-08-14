import * as React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import {TouchableNativeFeedback} from './Touchables';

import {VERY_LIGHT_BLUE} from '../lib/styles';
import type {ViewStyleProp} from '../sharedTypes';

type Props = {
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | (() => void);
  style?: ViewStyleProp;
  testID?: string;
};

const IconButtonNotMemoized = ({children, onPress, style, testID}: Props) => (
  <TouchableNativeFeedback
    testID={testID}
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}>
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  </TouchableNativeFeedback>
);

export const IconButton = React.memo<Props>(IconButtonNotMemoized);

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
