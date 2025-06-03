import {StyleSheet} from 'react-native';
import {WHITE, MAGENTA, BLACK, DARK_GREY} from '../../lib/styles';

const PRIMARY_CONTROL_DIAMETER = 96;
export const SIDE_ICON_BUTTON_WIDTH = 36;
export const MAX_RECORDING_DURATION_MS = 5 * 60_000;

export const AudioStyles = StyleSheet.create({
  contentContainer: {flex: 1, backgroundColor: DARK_GREY},
  dockContainer: {paddingVertical: 24, backgroundColor: DARK_GREY},
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
