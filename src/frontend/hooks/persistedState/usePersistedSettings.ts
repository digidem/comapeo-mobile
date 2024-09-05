import {type StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';
import {CoordinateFormat, SyncSetting} from '../../sharedTypes';

type SettingsSlice = {
  coordinateFormat: CoordinateFormat;
  manualCoordinateEntryFormat: CoordinateFormat;
  syncSetting: SyncSetting;
  actions: {
    setCoordinateFormat: (coordinateFormat: CoordinateFormat) => void;
    setManualCoordinateEntryFormat: (
      coordinateFormat: CoordinateFormat,
    ) => void;
    setSyncSetting: (syncSetting: SyncSetting) => void;
  };
};

const settingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  coordinateFormat: 'utm',
  manualCoordinateEntryFormat: 'utm',
  syncSetting: 'default',
  actions: {
    setCoordinateFormat: coordinateFormat => set({coordinateFormat}),
    setManualCoordinateEntryFormat: coordinateFormat =>
      set({manualCoordinateEntryFormat: coordinateFormat}),
    setSyncSetting: syncSetting => set({syncSetting}),
  },
});

export const usePersistedSettings = createPersistedState(
  settingsSlice,
  'Settings',
);

export const usePersistedSettingsAction = () =>
  usePersistedSettings(store => store.actions);
