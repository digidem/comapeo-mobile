import {create} from 'zustand';
import {useShallow} from 'zustand/react/shallow';
import {Permission, PermissionsAndroid, PermissionStatus} from 'react-native';

export const ANDROID_PERMISSIONS = {
  CAMERA: 'android.permission.CAMERA',
  ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
} as const;

type RelevantAndroidPermission = Extract<
  Permission,
  (typeof ANDROID_PERMISSIONS)[keyof typeof ANDROID_PERMISSIONS]
>;

type AppPermissions = {[key in RelevantAndroidPermission]: PermissionStatus};

interface PermissionsState {
  permissions: AppPermissions;
  actions: {
    requestPermissions: (
      permissions: Array<RelevantAndroidPermission>,
    ) => Promise<void>;
  };
}

const usePermissionsStore = create<PermissionsState>()(set => ({
  permissions: {
    [ANDROID_PERMISSIONS.CAMERA]: 'denied',
    [ANDROID_PERMISSIONS.ACCESS_COARSE_LOCATION]: 'denied',
    [ANDROID_PERMISSIONS.ACCESS_FINE_LOCATION]: 'denied',
  },
  actions: {
    requestPermissions: async permissions => {
      const result: AppPermissions =
        await PermissionsAndroid.requestMultiple(permissions);
      set(state => ({permissions: {...state.permissions, ...result}}));
    },
  },
}));

export const usePermissions = () =>
  usePermissionsStore(useShallow(({permissions}) => permissions));

export const usePermissionsActions = () =>
  usePermissionsStore(({actions}) => actions);
