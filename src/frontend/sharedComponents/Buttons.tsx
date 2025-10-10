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
  testID?: string;
  style?: ViewStyleProp;
};

export const PrimaryButton = ({
  onPress,
  renderIcon,
  iconPosition = 'left',
  text,
  fullSize,
  testID,
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={[
        style,
        buttonStyles.base,
        {backgroundColor: COMAPEO_BLUE},
        fullSize && {width: 280},
      ]}
      onPress={onPress}>
      {renderIcon && iconPosition === 'left' && (
        <View style={buttonStyles.iconSpacingLeft}>
          {renderIcon({color: WHITE, size: 25})}
        </View>
      )}
      <HeaderText variant="header5" style={{color: WHITE}}>
        {text}
      </HeaderText>
      {renderIcon && iconPosition === 'right' && (
        <View style={buttonStyles.iconSpacingRight}>
          {renderIcon({color: WHITE, size: 25})}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({
  onPress,
  renderIcon,
  iconPosition = 'left',
  text,
  fullSize,
  testID,
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={[
        style,
        buttonStyles.base,
        {
          backgroundColor: WHITE,
          borderWidth: 1.5,
          borderColor: BLUE_GREY,
        },
        fullSize && {width: 280},
      ]}
      onPress={onPress}>
      {renderIcon && iconPosition === 'left' && (
        <View style={buttonStyles.iconSpacingLeft}>
          {renderIcon({color: COMAPEO_BLUE, size: 25})}
        </View>
      )}
      <HeaderText variant="header5" style={{color: COMAPEO_BLUE}}>
        {text}
      </HeaderText>
      {renderIcon && iconPosition === 'right' && (
        <View style={buttonStyles.iconSpacingRight}>
          {renderIcon({color: COMAPEO_BLUE, size: 25})}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const DestructiveButton = ({
  onPress,
  renderIcon,
  iconPosition = 'left',
  text,
  fullSize,
  testID,
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={[
        style,
        buttonStyles.base,
        {backgroundColor: WARNING_RED},
        fullSize && {width: 280},
      ]}
      onPress={onPress}>
      {renderIcon && iconPosition === 'left' && (
        <View style={buttonStyles.iconSpacingLeft}>
          {renderIcon({color: WHITE, size: 25})}
        </View>
      )}
      <HeaderText variant="header5" style={{color: WHITE}}>
        {text}
      </HeaderText>
      {renderIcon && iconPosition === 'right' && (
        <View style={buttonStyles.iconSpacingRight}>
          {renderIcon({color: WHITE, size: 25})}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const buttonStyles = StyleSheet.create({
  base: {
    height: 50,
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
