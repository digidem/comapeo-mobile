import * as React from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';
import {DARK_GREY} from '../../lib/styles';
import {RUBIK, type RubikWeight} from '../../lib/fonts';

type Variant =
  'header1' | 'header2' | 'header3' | 'header4' | 'header5' | 'header6';

interface HeaderProps extends Omit<TextProps, 'style'> {
  style?: Omit<TextStyle, 'fontSize' | 'fontFamily' | 'fontWeight'>;
  variant?: Variant;
  weight?: RubikWeight;
}

/**
 * HeaderText should be used for all headers, form labels, and buttons. HeaderText uses rubik font at font weight 500
 *
 * `weight` picks the Rubik face (500 default, 400, 700). `fontWeight` cannot
 * select a face — see `lib/fonts`.
 *
 * Different `variant` types (default to `header1`):
 *
 * header1 = `{fontSize:32}`
 *
 * header2 = `{fontSize:24}`
 *
 * header3 = `{fontSize:20}`
 *
 * header4 = `{fontSize:18}`
 *
 * header5 = `{fontSize:16}`
 *
 * header6 = `{fontSize:14}`
 *
 */
export const HeaderText = ({
  children,
  style,
  variant,
  weight = 500,
  ...otherTextProps
}: React.PropsWithChildren<HeaderProps>) => {
  return (
    <RNText
      style={[
        {
          fontFamily: RUBIK[weight],
          color: DARK_GREY,
          fontSize: fontSizeMap[variant || 'header1'],
        },
        style,
      ]}
      {...otherTextProps}>
      {children}
    </RNText>
  );
};

const fontSizeMap: {[key in Variant]: number} = {
  header1: 32,
  header2: 24,
  header3: 20,
  header4: 18,
  header5: 16,
  header6: 14,
};
