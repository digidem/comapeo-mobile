import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from './Text';
import {TouchableNativeFeedback} from '../sharedComponents/Touchables';

import {VERY_LIGHT_BLUE} from '../lib/styles';
import type {ViewStyleProp} from '../sharedTypes';

type Props = {
  onPress: () => void;
  containerStyle?: ViewStyleProp;
  textStyle?: ViewStyleProp;
  title: string;
  testID?: string;
  style?: ViewStyleProp;
};

export const TextButton = ({
  onPress,
  containerStyle,
  textStyle,
  title,
  testID,
}: Props) => (
  <TouchableNativeFeedback
    style={[styles.buttonContainer, containerStyle]}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
    onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'blue',
    fontWeight: '700',
  },
});
