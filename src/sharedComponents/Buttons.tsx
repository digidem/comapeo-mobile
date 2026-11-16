import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {HeaderText} from './Text/HeaderText';
import {BLUE_GREY, COMAPEO_BLUE, WARNING_RED, WHITE} from '../lib/styles';
import {ViewStyleProp} from '../sharedTypes';

type ButtonProps = {
  renderIcon?: (props: {color: string; size: number}) => React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullSize: boolean;
  text: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  style?: ViewStyleProp;
};

type ButtonColors = {
  background: string;
  text: string;
  icon: string;
  border: string;
};

const BaseButton = ({
  onPress,
  renderIcon,
  iconPosition = 'left',
  text,
  fullSize,
  disabled = false,
  testID,
  style,
  colors,
}: ButtonProps & {colors: ButtonColors}) => {
  return (
    <TouchableOpacity
      testID={testID}
      disabled={disabled}
      accessibilityState={{disabled}}
      style={[
        style,
        buttonStyles.base,
        {
          backgroundColor: colors.background,
          borderWidth: 1.5,
          borderColor: colors.border,
        },
        fullSize && {width: 280},
      ]}
      onPress={onPress}>
      {renderIcon && iconPosition === 'left' && (
        <View style={buttonStyles.iconSpacingLeft}>
          {renderIcon({color: colors.icon, size: 25})}
        </View>
      )}
      <HeaderText
        variant="header5"
        style={{color: colors.text, flexShrink: 1, textAlign: 'center'}}>
        {text}
      </HeaderText>
      {renderIcon && iconPosition === 'right' && (
        <View style={buttonStyles.iconSpacingRight}>
          {renderIcon({color: colors.icon, size: 25})}
        </View>
      )}
    </TouchableOpacity>
  );
};

const DisabledButton = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      colors={{
        background: BLUE_GREY,
        text: WHITE,
        icon: WHITE,
        border: BLUE_GREY,
      }}
    />
  );
};

export const PrimaryButton = (props: ButtonProps) => {
  if (props.disabled) {
    return <DisabledButton {...props} />;
  }

  return (
    <BaseButton
      {...props}
      colors={{
        background: COMAPEO_BLUE,
        text: WHITE,
        icon: WHITE,
        border: COMAPEO_BLUE,
      }}
    />
  );
};

export const SecondaryButton = (props: ButtonProps) => {
  if (props.disabled) {
    return <DisabledButton {...props} />;
  }

  return (
    <BaseButton
      {...props}
      colors={{
        background: WHITE,
        text: COMAPEO_BLUE,
        icon: COMAPEO_BLUE,
        border: BLUE_GREY,
      }}
    />
  );
};

export const DestructiveButton = (props: ButtonProps) => {
  if (props.disabled) {
    return <DisabledButton {...props} />;
  }

  return (
    <BaseButton
      {...props}
      colors={{
        background: WARNING_RED,
        text: WHITE,
        icon: WHITE,
        border: WARNING_RED,
      }}
    />
  );
};

export const SecondaryDestructiveButton = (props: ButtonProps) => {
  if (props.disabled) {
    return <DisabledButton {...props} />;
  }

  return (
    <BaseButton
      {...props}
      colors={{
        background: WHITE,
        text: WARNING_RED,
        icon: WARNING_RED,
        border: BLUE_GREY,
      }}
    />
  );
};

export const buttonStyles = StyleSheet.create({
  base: {
    minHeight: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    overflow: 'hidden',
  },
  iconSpacingLeft: {
    marginRight: 10,
  },
  iconSpacingRight: {
    marginLeft: 10,
  },
});
