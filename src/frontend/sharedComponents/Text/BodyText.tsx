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

  switch (variant) {
    case 'large':
      computedStyle = {fontSize: 20, lineHeight: 1.5};
      break;
    case 'smallMeta':
      computedStyle = {fontSize: 14};
      break;
    case 'tinyMeta':
      computedStyle = {fontSize: 12};
      break;
    case 'regular':
    default:
      computedStyle = {fontSize: 16, lineHeight: 1.5};
      break;
  }

  return (
    <RNText style={[{color: BLACK}, computedStyle, style]} {...otherTextProps}>
      {children}
    </RNText>
  );
};
