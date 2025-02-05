import {StyleSheet} from 'react-native';
import {WHITE, MAGENTA} from '../lib/styles';

const PRIMARY_CONTROL_DIAMETER = 96;

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
});
