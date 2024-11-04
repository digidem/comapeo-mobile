import * as React from 'react';
import {Text as RNText, StyleProp, TextProps, TextStyle} from 'react-native';
import {BLACK} from '../lib/styles';

type fontVariant = 'primary' | 'body';

/**
 *
 * Font, font sizing and font weight, should follow designs in figma.
 * Generally all headers, labels, and button us Rubik (set `variant` to "primary").
 * Paragraph and body text should use the device's System Font.
 * Refer to this [design sytem](https://www.notion.so/digidem/Typography-a1600603854445ad82b8d67d4067be1a) for more info.
 */
export const Text = ({
  children,
  style,
  variant = 'body',
  ...otherTextProps
}: React.PropsWithChildren<TextProps> & {variant?: fontVariant}) => {
  const computedStyle = React.useMemo(
    () => [
      style,
      {fontFamily: getFontFamily({styleObj: style, variant: variant})}, // Set the correct fontFamily based on fontWeight
    ],
    [style, variant],
  );

  return (
    <RNText
      style={[
        {color: BLACK, fontSize: variant === 'primary' ? 16 : 14},
        computedStyle,
      ]}
      {...otherTextProps}>
      {children}
    </RNText>
  );
};

function getFontFamily({
  styleObj,
  variant,
}: {
  styleObj: StyleProp<TextStyle> | undefined;
  variant: fontVariant;
}) {
  if (variant === 'body') return undefined;
  let fontWeight: TextStyle['fontWeight'] | undefined;

  // Check if style is an array or an object
  if (Array.isArray(styleObj)) {
    // If it's an array, merge the objects and extract the fontWeight
    const mergedStyle = Object.assign({}, ...styleObj) as TextStyle;
    fontWeight = mergedStyle.fontWeight;
  } else if (typeof styleObj === 'object' && styleObj !== null) {
    // If it's a single object, directly access fontWeight
    fontWeight = styleObj.fontWeight;
  }

  switch (fontWeight) {
    case '100':
    case '200':
    case '300':
      return 'Rubik_300Light';
    case '400':
    case 'normal':
      return 'Rubik_400Regular';
    case '500':
      return 'Rubik_500Medium';
    case '600':
      return 'Rubik_600SemiBold';
    case '700':
    case 'bold':
      return 'Rubik_700Bold';
    case '800':
      return 'Rubik_800ExtraBold';
    case '900':
      return 'Rubik_900Black';
    default:
      return 'Rubik_400Regular'; // Fallback to regular if no weight is specified
  }
}
