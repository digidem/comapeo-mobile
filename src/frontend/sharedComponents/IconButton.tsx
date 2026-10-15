import * as React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import {TouchableNativeFeedback} from './Touchables';

import {VERY_LIGHT_BLUE} from '../lib/styles';
import type {ViewStyleProp} from '../sharedTypes';

// specific height applied for iOS pre 26 to ensure header item centered in the navigation bar
// specific width applied so iOS with liquid glass has the correct-sized oval around header item
export const headerItemStyle = StyleSheet.create({
  container: {
    width: 60,
    height: 44,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
}).container;

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
    hitSlop={{top: 8, bottom: 8}}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}>
    <View
      style={[headerItemStyle, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  </TouchableNativeFeedback>
);

export const IconButton = React.memo<Props>(IconButtonNotMemoized);
