import {defineMessages, MessageDescriptor} from 'react-intl';
import {AppStackParamsList, HomeTabsParamsList} from './sharedTypes/navigation';

const m = defineMessages({
  orange: {
    id: 'constants.orange',
    defaultMessage: 'Orange',
  },
  blue: {
    id: 'constants.blue',
    defaultMessage: 'Blue',
  },
  green: {
    id: 'constants.green',
    defaultMessage: 'Green',
  },
  red: {
    id: 'constants.red',
    defaultMessage: 'Red',
  },
  grey: {
    id: 'constants.grey',
    defaultMessage: 'Grey',
  },
});

// this has to be a string because js does not recognize 00000 as being 5 digits
export const OBSCURE_PASSCODE = '00000';

export const EDITING_SCREEN_NAMES: (
  | keyof AppStackParamsList
  | keyof HomeTabsParamsList
)[] = [
  'AddPhoto',
  'TrackCategoryChooser',
  'ObservationCategoryChooser',
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

export const MAP_SHARE_SCREEN_NAMES: (keyof AppStackParamsList)[] = [
  'MapReceivedBottomSheet',
  'ReplaceBackgroundMap',
  'ReceivingBackgroundMap',
  'SendingBackgroundMap',
];

// Replicates the root query key from comapeo/core-react v3.3.0
// (see https://github.com/digidem/comapeo-core-react/blob/59a80cf0a1b9dad13e5f066233dae2465d2d20b1/src/lib/react-query/shared.ts#L6)
// so partial invalidations align with the library’s queries.
export const ROOT_QUERY_KEY = '@comapeo/core-react';

type projectColor = {
  label: MessageDescriptor;
  color: string;
};

export const projectColors: projectColor[] = [
  {color: '#FFF5EB', label: m.orange},
  {color: '#E5F0FF', label: m.blue},
  {color: '#EEF6EE', label: m.green},
  {color: '#FBE9E9', label: m.red},
  {color: '#E5E5EB', label: m.grey},
];

export const DEFAULT_PROJECT_COLOR = '#FFF5EB';
