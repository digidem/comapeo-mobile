import * as React from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';
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
  return (
    <RNText
      style={[
        {color: BLACK, fontSize: fontSizeMap[variant || 'regular']},
        style,
      ]}
      {...otherTextProps}>
      {children}
    </RNText>
  );
};

const fontSizeMap: {[key in Variant]: number} = {
  large: 20,
  regular: 16,
  smallMeta: 14,
  tinyMeta: 12,
};
