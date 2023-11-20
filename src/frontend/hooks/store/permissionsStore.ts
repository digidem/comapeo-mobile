import {create} from 'zustand';
import {useShallow} from 'zustand/react/shallow';
import {Permission, PermissionsAndroid, PermissionStatus} from 'react-native';

type RelevantAndroidPermission = Extract<
  Permission,
  | 'android.permission.CAMERA'
  | 'android.permission.ACCESS_FINE_LOCATION'
  | 'android.permission.ACCESS_COARSE_LOCATION'
>;

type AppPermissions = {[key in RelevantAndroidPermission]: PermissionStatus};

export const PERMISSIONS = {
  CAMERA: 'android.permission.CAMERA',
  ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
} as const;

interface PermissionsState {
  permissions: AppPermissions;
  actions: {
    requestPermissions: (
      permissions: Array<(typeof PERMISSIONS)[keyof typeof PERMISSIONS]>,
    ) => Promise<void>;
  };
}

const usePermissionsStore = create<PermissionsState>()(set => ({
  permissions: {
    'android.permission.CAMERA': 'denied',
    'android.permission.ACCESS_COARSE_LOCATION': 'denied',
    'android.permission.ACCESS_FINE_LOCATION': 'denied',
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
