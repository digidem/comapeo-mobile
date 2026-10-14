import * as React from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';
import {DARK_GREY} from '../../lib/styles';
import {RUBIK, type RubikWeight} from '../../lib/fonts';

type Variant = 'large' | 'medium' | 'regular' | 'smallMeta' | 'tinyMeta';

interface BodyProps extends Omit<TextProps, 'style'> {
  style?: Omit<TextStyle, 'fontSize' | 'fontFamily' | 'fontWeight'>;
  variant?: Variant;
  weight?: RubikWeight;
}

/**
 * Body text uses the Rubik font and opinionted font sizes and font weight. Should be used for most text.
 *
 * `weight` picks the Rubik face (400 default, 500, 700). `fontWeight` cannot
 * select a face — see `lib/fonts`.
 *
 * Different `variant` types (default to 'regular'):
 *
 * large = `{fontSize:20}`
 *
 * medium = `{fontSize: 18}`
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
  weight = 400,
  ...otherTextProps
}: React.PropsWithChildren<BodyProps>) => {
  return (
    <RNText
      style={[
        {
          fontFamily: RUBIK[weight],
          color: DARK_GREY,
          fontSize: fontSizeMap[variant || 'regular'],
        },
        style,
      ]}
      {...otherTextProps}>
      {children}
    </RNText>
  );
};

const fontSizeMap: {[key in Variant]: number} = {
  large: 20,
  medium: 18,
  regular: 16,
  smallMeta: 14,
  tinyMeta: 12,
};
