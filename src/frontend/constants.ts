import {AppStackParamsList, HomeTabsParamsList} from './sharedTypes/navigation';

// this has to be a string because js does not recognize 00000 as being 5 digits
export const OBSCURE_PASSCODE = '00000';

export const EDITING_SCREEN_NAMES:
  | Omit<keyof AppStackParamsList, 'Home'>[]
  | (keyof HomeTabsParamsList)[] = [
  'AddPhoto',
  'PresetChooser',
  'ManualGpsScreen',
  'ObservationDetails',
  'ObservationEdit',
  'Camera',
];
