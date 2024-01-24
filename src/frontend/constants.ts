import {Route, useNavigation} from '@react-navigation/native';
import {AppStackList} from './Navigation/AppStack';

// this has to be a string because js does not recognize 00000 as being 5 digits
export const OBSCURE_PASSCODE = '00000';

export const EDITING_SCREEN_NAMES = [
  'AddPhoto',
  'PresetChooser',
  'ManualGpsScreen',
  'ObservationDetails',
  'ObservationEdit',
  'Home',
];
