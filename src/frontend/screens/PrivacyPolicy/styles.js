import {
  BLACK,
  BLUE_GREY,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
} from '../../lib/styles';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  overviewBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    backgroundColor: VERY_LIGHT_GREY,
    marginBottom: 20,
  },
  overviewText: {
    fontSize: 14,
    marginBottom: 10,
  },
  toggleContainer: {
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    marginBottom: 0,
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  topToggleContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomToggleContainer: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  header: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  sectionHeader: {
    paddingVertical: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    textAlign: 'left',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: NEW_DARK_GREY,
  },
  pointContainer: {
    marginBottom: 20,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: BLACK,
  },
  pointDescription: {
    fontSize: 14,
    color: NEW_DARK_GREY,
  },
  horizontalLine: {
    borderBottomColor: BLUE_GREY,
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  diagnosticsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    marginBottom: 20,
  },
  diagnosticsContent: {
    paddingLeft: 10,
    marginTop: 16,
  },
  diagnosticsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginLeft: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  bulletIcon: {
    marginTop: 8,
    marginRight: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: NEW_DARK_GREY,
  },
  diagnosticsDescription: {
    fontSize: 14,
    color: NEW_DARK_GREY,
    marginLeft: 5,
    textAlign: 'left',
    fontWeight: 'normal',
  },
  horizontalLineSmall: {
    borderBottomColor: BLUE_GREY,
    borderBottomWidth: 1,
    marginVertical: 20,
  },
});
