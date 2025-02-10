import * as React from 'react';
import {StyleSheet} from 'react-native';
import {WHITE, MAGENTA, DARK_GREY, BLACK} from '../lib/styles';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {CustomHeaderLeft} from './CustomHeaderLeft';

const PRIMARY_CONTROL_DIAMETER = 96;
export const SIDE_ICON_BUTTON_WIDTH = 36;

export const AudioStyles = StyleSheet.create({
  contentContainer: {flex: 1},
  dockContainer: {paddingVertical: 24},
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 48,
  },
  message: {
    color: WHITE,
    textAlign: 'center',
  },
  timerText: {
    fontFamily: 'Rubik',
    fontSize: 96,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  basePressable: {
    height: PRIMARY_CONTROL_DIAMETER,
    width: PRIMARY_CONTROL_DIAMETER,
    borderRadius: PRIMARY_CONTROL_DIAMETER,
    borderWidth: 12,
    borderColor: WHITE,
    overflow: 'hidden',
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  record: {
    height: PRIMARY_CONTROL_DIAMETER,
    backgroundColor: MAGENTA,
  },
  stop: {
    height: PRIMARY_CONTROL_DIAMETER / 3,
    width: PRIMARY_CONTROL_DIAMETER / 3,
    backgroundColor: BLACK,
    alignSelf: 'center',
  },
  play: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const sharedAudioNavOptions: NativeStackNavigationOptions = {
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
