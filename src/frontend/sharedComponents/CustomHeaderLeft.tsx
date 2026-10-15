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
    // iOS 26 draws a glass capsule around the button ("liquid glass"),
    // in order to match the header buttons on the right, we need to set the width explicitly on iOS.
    // the margin is only needed for Android because it would be inside the capsule on iOS
    ...Platform.select({
      ios: {width: HEADER_BUTTON_SIZE, justifyContent: 'center' as const},
      default: {marginRight: 15},
    }),
  },
}).headerStyles;
