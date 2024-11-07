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
  variant?: Variant;
}

/**
 * HeaderText should be used for all headers, form labels, and buttons. HeaderText uses rubik font at font weight 500
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
  ...otherTextProps
}: React.PropsWithChildren<HeaderProps>) => {
  return (
    <RNText
      style={[
        {
          fontFamily: 'Rubik_500Medium',
          color: BLACK,
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
