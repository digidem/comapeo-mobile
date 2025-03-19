import {AppStackParamsList, HomeTabsParamsList} from './sharedTypes/navigation';

// this has to be a string because js does not recognize 00000 as being 5 digits
export const OBSCURE_PASSCODE = '00000';

export const EDITING_SCREEN_NAMES:
  | Omit<keyof AppStackParamsList, 'Home'>[]
  | (keyof HomeTabsParamsList)[] = [
  'AddPhoto',
  'PresetChooser',
  'ManualGpsScreen',
  'ObservationCreate',
  'ObservationDetails',
  'ObservationEdit',
  'SaveTrackScreen',
  'TrackEdit',
  'Camera',
];

/**
 * This constant should be used for tracks and for the userlocation dot. In order for the user location dot to align with the track on the map, they need to update at the same frequency.
 */
export const TRACKING_DISTANCE_INTERVAL = 2;
