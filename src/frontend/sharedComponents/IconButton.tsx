import * as React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import {TouchableNativeFeedback} from './Touchables';

import {VERY_LIGHT_BLUE} from '../lib/styles';
import type {ViewStyleProp} from '../sharedTypes';

export const HEADER_BUTTON_SIZE = 60;

type Props = {
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | (() => void);
  style?: ViewStyleProp;
  testID?: string;
  accessibilityLabel?: string;
};

const IconButtonNotMemoized = ({
  children,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: Props) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}>
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  </TouchableNativeFeedback>
);

export const IconButton = React.memo<Props>(IconButtonNotMemoized);

const styles = StyleSheet.create({
  container: {
    width: HEADER_BUTTON_SIZE,
    height: HEADER_BUTTON_SIZE,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
