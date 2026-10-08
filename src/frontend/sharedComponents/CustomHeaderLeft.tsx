import React from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/elements';

import {BackIcon} from './icons';
import {BLACK} from '../lib/styles';
import {HEADER_BUTTON_SIZE} from './IconButton';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {Platform, StyleSheet} from 'react-native';

// We use a slightly larger back icon, to improve accessibility
// TODO iOS: This should probably be a chevron not an arrow
export const HeaderBackIcon = ({tintColor}: {tintColor: string}) => {
  return <BackIcon color={tintColor} />;
};

interface CustomHeaderLeftProps {
  tintColor?: string;
  headerBackButtonProps: HeaderBackButtonProps;
  onPress?: () => void;
}

export const CustomHeaderLeft = ({
  tintColor,
  headerBackButtonProps,
  onPress,
}: CustomHeaderLeftProps) => {
  const navigation = useNavigationFromRoot();
  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      // next line is needed for iOS so it doesn't include the previous screen's title in the back button
      displayMode="minimal"
      testID="MAIN.header-back-btn"
      onPress={onPress || (() => navigation.goBack())}
      style={CustomHeaderLeftStyles}
      backImage={() => <HeaderBackIcon tintColor={tintColor || BLACK} />}
    />
  );
};

export const CustomHeaderLeftStyles = StyleSheet.create({
  headerStyles: {
    marginLeft: 0,
    // iOS 26 draws a glass capsule around the button's frame ("liquid glass"),
    // so the frame has to match the header buttons on the right or the capsules
    // come out different shapes. A trailing margin would sit inside the capsule
    // and push the arrow off center; Android has no capsule and needs the gap
    // before the title.
    ...Platform.select({
      ios: {width: HEADER_BUTTON_SIZE, justifyContent: 'center' as const},
      default: {marginRight: 15},
    }),
  },
}).headerStyles;
