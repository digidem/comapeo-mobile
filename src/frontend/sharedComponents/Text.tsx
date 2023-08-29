import * as React from 'react';
import {Text as RNText, TextProps} from 'react-native';

export const Text = ({
  children,
  style,
  ...otherTextProps
}: React.PropsWithChildren<TextProps>) => (
  <RNText style={[{fontFamily: 'Roboto'}, style]} {...otherTextProps}>
    {children}
  </RNText>
);
