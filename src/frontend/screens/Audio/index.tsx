import React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {DARK_GREY, WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {StatusBar} from 'expo-status-bar';
import {CreateRecording} from './CreateRecording';

export function Audio() {
  return (
    <>
      <StatusBar style="light" />
      <CreateRecording />
    </>
  );
}

export const navigationOptions: NativeStackNavigationOptions = {
  contentStyle: {backgroundColor: DARK_GREY},
  headerTintColor: WHITE,
  headerShadowVisible: false,
  headerTitle: () => null,
  headerStyle: {backgroundColor: 'transparent'},
  headerTransparent: true,
  headerLeft: props => (
    <CustomHeaderLeft
      tintColor={props.tintColor}
      headerBackButtonProps={props}
    />
  ),
};
