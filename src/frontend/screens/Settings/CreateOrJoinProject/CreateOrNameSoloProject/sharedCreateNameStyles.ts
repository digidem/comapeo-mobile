import {StyleSheet} from 'react-native';
import {BLUE_GREY, NEW_DARK_GREY} from '../../../../lib/styles';

export const createStyles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: BLUE_GREY,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  infoBox: {
    marginHorizontal: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    gap: 12,
  },
  infoHeading: {marginBottom: 4, paddingLeft: 4},
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  infoIcon: {marginTop: 2},
  infoText: {flex: 1, color: NEW_DARK_GREY},
});
