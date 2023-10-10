import {StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';

type DeviceNameSlice = {
  deviceName: string | null;
  setDeviceName: (deviceName: string) => void;
};

const deviceNameSlice: StateCreator<DeviceNameSlice> = set => ({
  deviceName: null,
  setDeviceName: name => set({deviceName: name}),
});

export const usePersistedDeviceName = createPersistedState(
  deviceNameSlice,
  '@DeviceName',
);
