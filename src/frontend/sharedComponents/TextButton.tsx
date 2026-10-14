import * as React from 'react';
import {StyleSheet, TextStyle} from 'react-native';
import {HeaderText} from './Text/HeaderText';
import {TouchableNativeFeedback} from '../sharedComponents/Touchables';

import {COMAPEO_BLUE, VERY_LIGHT_BLUE} from '../lib/styles';
import type {ViewStyleProp} from '../sharedTypes';

type Props = {
  onPress: () => void;
  containerStyle?: ViewStyleProp;
  textStyle?: TextStyle;
  title: string;
  style?: ViewStyleProp;
};

export const TextButton = ({
  onPress,
  containerStyle,
  textStyle,
  title,
}: Props) => (
  <TouchableNativeFeedback
    style={[styles.buttonContainer, containerStyle]}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
    onPress={onPress}>
    <HeaderText
      weight={700}
      variant="header5"
      style={{...styles.buttonText, ...textStyle}}>
      {title}
    </HeaderText>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COMAPEO_BLUE,
  },
});
