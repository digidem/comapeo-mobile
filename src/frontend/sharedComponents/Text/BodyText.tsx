import * as React from 'react';
import {Text as RNText, StyleProp, TextProps, TextStyle} from 'react-native';
import {BLACK} from '../../lib/styles';

type Variant = 'large' | 'regular' | 'smallMeta' | 'tinyMeta';

interface BodyProps extends Omit<TextProps, 'style'> {
  style?: Omit<TextStyle, 'fontSize' | 'fontFamily' | 'fontWeight'>;
  variant?: Variant;
}

/**
 * Body text uses system font and opinated font sizes and font weight. Should be used for most text.
 *
 * Different `variant` types (default to 'regular'):
 *
 * large = `{fontSize:20}`
 *
 * regular = `{fontSize:16}`
 *
 * smallMeta = `{fontSize:14}`
 *
 * tinyMeta = `{fontSize:12}`
 */
export const BodyText = ({
  children,
  style,
  variant,
  ...otherTextProps
}: React.PropsWithChildren<BodyProps>) => {
  let computedStyle: StyleProp<TextStyle>;

  let fontSize: number;
  switch (variant) {
    case 'large':
      fontSize = 20;
      computedStyle = {fontSize};
      break;
    case 'smallMeta':
      fontSize = 14;
      computedStyle = {fontSize};
      break;
    case 'tinyMeta':
      fontSize = 12;
      computedStyle = {fontSize};
      break;
    case 'regular':
    default:
      fontSize = 16;
      computedStyle = {fontSize};
      break;
  }

  return (
    <RNText style={[{color: BLACK}, computedStyle, style]} {...otherTextProps}>
      {children}
    </RNText>
  );
};
