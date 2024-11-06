import * as React from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';
import {BLACK} from '../../lib/styles';

type Variant =
  | 'header1'
  | 'header2'
  | 'header3'
  | 'header4'
  | 'header5'
  | 'header6';

interface HeaderProps extends Omit<TextProps, 'style'> {
  style?: Omit<TextStyle, 'fontSize' | 'fontFamily' | 'fontWeight'>;
  variant: Variant;
}

export const Header = ({
  children,
  style,
  variant,
  ...otherTextProps
}: React.PropsWithChildren<HeaderProps>) => {
  let fontSize: number;

  switch (variant) {
    case 'header1':
      fontSize = 32;
      break;
    case 'header2':
      fontSize = 24;
      break;
    case 'header3':
      fontSize = 20;
      break;
    case 'header4':
      fontSize = 18;
      break;
    case 'header5':
      fontSize = 16;
      break;
    case 'header6':
      fontSize = 14;
      break;
  }

  return (
    <RNText
      style={[{fontFamily: 'Rubik_500Medium', color: BLACK, fontSize}, style]}
      {...otherTextProps}>
      {children}
    </RNText>
  );
};
