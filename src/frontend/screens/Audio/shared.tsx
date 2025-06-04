import {StyleSheet} from 'react-native';
import {WHITE, BLACK, BLUE_GREY, NEW_DARK_GREY} from '../../lib/styles';

export const PRIMARY_CONTROL_DIAMETER = 96;
export const SIDE_ICON_BUTTON_WIDTH = 60;
export const MAX_RECORDING_DURATION_MS = 5 * 60_000;

export const audioStyles = StyleSheet.create({
  basePressable: {
    height: PRIMARY_CONTROL_DIAMETER,
    width: PRIMARY_CONTROL_DIAMETER,
    borderRadius: PRIMARY_CONTROL_DIAMETER,
    borderWidth: 12,
    borderColor: WHITE,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  stop: {
    height: PRIMARY_CONTROL_DIAMETER / 3,
    width: PRIMARY_CONTROL_DIAMETER / 3,
    backgroundColor: BLACK,
    alignSelf: 'center',
  },
  audioBox: {
    width: 300,
    height: 300,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 30,
  },
  timerText: {
    color: WHITE,
    textAlign: 'center',
    fontSize: 96,
    fontFamily: 'Rubik_500Medium',
  },
  textStyle: {
    color: NEW_DARK_GREY,
    textAlign: 'center',
  },
});
