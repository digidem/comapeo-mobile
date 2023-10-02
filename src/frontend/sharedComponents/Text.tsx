import * as React from 'react';
import {Text as RNText, TextProps} from 'react-native';
import {BLACK} from '../lib/styles';

export const Text = ({
  children,
  style,
  ...otherTextProps
}: React.PropsWithChildren<TextProps>) => (
  <RNText
    style={[{fontFamily: 'Roboto', color: BLACK}, style]}
    {...otherTextProps}>
    {children}
  </RNText>
);
