import React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {DARK_GREY, WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {CreateRecording} from './CreateRecording';
import {StatusBar} from 'expo-status-bar';

export function Audio({route}: NativeRootNavigationProps<'Audio'>) {
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
