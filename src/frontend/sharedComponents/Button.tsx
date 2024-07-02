import * as React from 'react';
import {GestureResponderEvent, StyleSheet, View, ViewStyle} from 'react-native';

import {BLACK, COMAPEO_BLUE, VERY_LIGHT_BLUE} from '../lib/styles';
import {Text} from './Text';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';

import {ViewStyleProp} from '../sharedTypes';

type ColorScheme = 'dark' | 'light' | 'ComapeoBlue';
type Variant = 'contained' | 'outlined' | 'text';
type Size = 'medium' | 'large';

interface SharedTouchableProps {
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

interface Props {
  TouchableComponent?: React.ComponentType<Partial<SharedTouchableProps>>;
  children: React.ReactNode;
  color?: ColorScheme;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  size?: Size;
  style?: ViewStyleProp;
  testID?: string;
  variant?: Variant;
}

export const Button = ({
  TouchableComponent,
  children,
  color = 'dark',
  disabled = false,
  fullWidth = false,
  onPress,
  size = 'medium',
  style,
  variant = 'contained',
  testID = '',
}: Props) => {
  const buttonStyle = getButtonStyle(variant);
  const textStyle = getTextStyle({color, variant, disabled});
  const touchableStyle = getTouchableStyle(size);

  const sharedTouchableProps = {
    disabled,
    onPress: disabled ? undefined : onPress,
  };

  const buttonContent = (
    <View style={touchableStyle as ViewStyle} testID={testID}>
      {
        typeof children === 'string' ? (
          <Text style={[styles.textBase, textStyle]}>{children}</Text>
        ) : (
          children
        )
        // TODO: Handle <FormattedMessage> as children (wrapping in <Text>)
      }
    </View>
  );

  return (
    <View
      style={[
        styles.buttonBase,
        buttonStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}>
      {TouchableComponent ? (
        <TouchableComponent {...sharedTouchableProps}>
          {buttonContent}
        </TouchableComponent>
      ) : (
        <TouchableNativeFeedback
          {...sharedTouchableProps}
          background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
          {buttonContent}
        </TouchableNativeFeedback>
      )}
    </View>
  );
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getButtonStyle(variant?: Variant) {
  if (variant) {
    return variant === 'contained'
      ? styles.buttonContained
      : variant === 'outlined'
        ? styles.buttonOutlined
        : undefined;
  }
}

function getTextStyle({
  color,
  disabled,
  variant,
}: {
  color?: ColorScheme;
  disabled?: boolean;
  variant?: Variant;
}) {
  if (variant && color) {
    return styles[
      ('text' +
        capitalize(variant) +
        capitalize(color) +
        (disabled ? 'Disabled' : '')) as keyof typeof styles
    ];
  }
}

function getTouchableStyle(size: Size) {
  return styles[('touchable' + capitalize(size)) as keyof typeof styles];
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 30,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  buttonContained: {
    backgroundColor: '#0066FF',
  },
  buttonOutlined: {
    borderColor: '#EEEEEE',
    borderWidth: 1.5,
  },
  touchableMedium: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableSmall: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBase: {
    fontWeight: '700',
    letterSpacing: 0.5,
    fontSize: 16,
    color: '#FFFFFF',
  },
  textOutlinedLight: {
    color: '#FFFFFF',
  },
  textOutlinedDark: {
    color: BLACK,
  },
  textOutlinedComapeoBlue: {
    color: COMAPEO_BLUE,
  },
  textOutlinedLightDisabled: {
    color: '#666666',
  },
  textOutlinedDarkDisabled: {
    color: '#999999',
  },
});
