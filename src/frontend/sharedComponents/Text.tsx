import * as React from 'react';
import {Text as RNText, StyleProp, TextProps, TextStyle} from 'react-native';
import {BLACK} from '../lib/styles';

export const Text = ({
  children,
  style,
  bodyText,
  ...otherTextProps
}: React.PropsWithChildren<TextProps> & {bodyText?: boolean}) => {
  function getFontFamily(styleObj: StyleProp<TextStyle> | undefined) {
    if (bodyText) return undefined;
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

  const computedStyle = [
    style,
    {fontFamily: getFontFamily(style)}, // Set the correct fontFamily based on fontWeight
  ];

  return (
    <RNText
      style={[{color: BLACK, fontSize: bodyText ? 16 : 14}, computedStyle]}
      {...otherTextProps}>
      {children}
    </RNText>
  );
};
