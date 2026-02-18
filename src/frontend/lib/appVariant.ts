import {applicationId} from 'expo-application';

export type AppVariant = 'development' | 'rc' | 'production' | 'preRelease';

export function getAppVariant(): AppVariant {
  if (applicationId?.endsWith('.dev')) {
    return 'development';
  }

  if (applicationId?.endsWith('.rc')) {
    return 'rc';
  }

  if (applicationId?.endsWith('.pre')) {
    return 'preRelease';
  }

  return 'production';
}
