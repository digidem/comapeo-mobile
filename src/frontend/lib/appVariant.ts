import {applicationId} from 'expo-application';

export type AppVariant = 'development' | 'rc' | 'production' | 'preRelease';

export const APP_VARIANT: AppVariant = applicationId?.endsWith('.dev')
  ? 'development'
  : applicationId?.endsWith('.rc')
    ? 'rc'
    : applicationId?.endsWith('.pre')
      ? 'preRelease'
      : 'production';
