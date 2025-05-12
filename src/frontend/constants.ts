import {AppStackParamsList, HomeTabsParamsList} from './sharedTypes/navigation';

// this has to be a string because js does not recognize 00000 as being 5 digits
export const OBSCURE_PASSCODE = '00000';

export const EDITING_SCREEN_NAMES: (
  | keyof AppStackParamsList
  | keyof HomeTabsParamsList
)[] = [
  'AddPhoto',
  'PresetChooser',
  'ManualGpsScreen',
  'ObservationCreate',
  'ObservationDetails',
  'ObservationEdit',
  'SaveTrack',
  'TrackEdit',
  'Camera',
  'IntroToCoMapeo',
  'DataPrivacy',
  'DeviceNaming',
  'OnboardingPrivacyPolicy',
  'Success',
  'AuthScreen',
  'ErrorBottomSheet',
];

export const INVITE_SCREEN_NAME: (keyof AppStackParamsList)[] = [
  'InviteReceived',
  'InviteCanceled',
  'InviteSuccessfullyAccepted',
  'TrackRecordingActive',
];

// Replicates the root query key from comapeo/core-react v3.3.0
// (see https://github.com/digidem/comapeo-core-react/blob/59a80cf0a1b9dad13e5f066233dae2465d2d20b1/src/lib/react-query/shared.ts#L6)
// so partial invalidations align with the library’s queries.
export const ROOT_QUERY_KEY = '@comapeo/core-react';
