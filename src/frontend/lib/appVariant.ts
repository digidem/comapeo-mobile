import {applicationId} from 'expo-application';

export type AppVariant =
  | 'development'
  | 'releaseCandidate'
  | 'production'
  | 'preRelease';

export const APP_VARIANT: AppVariant = applicationId?.endsWith('.dev')
  ? 'development'
  : applicationId?.endsWith('.rc')
    ? 'releaseCandidate'
    : applicationId?.endsWith('.pre')
      ? 'preRelease'
      : 'production';
