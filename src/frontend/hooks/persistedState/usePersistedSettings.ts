import {type StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';
import {CoordinateFormat, MediaSyncSetting} from '../../sharedTypes';

type SettingsSlice = {
  coordinateFormat: CoordinateFormat;
  manualCoordinateEntryFormat: CoordinateFormat;
  mediaSyncSetting: MediaSyncSetting;
  actions: {
    setCoordinateFormat: (coordinateFormat: CoordinateFormat) => void;
    setManualCoordinateEntryFormat: (
      coordinateFormat: CoordinateFormat,
    ) => void;
    setMediaSyncSetting: (mediaSyncSetting: MediaSyncSetting) => void;
  };
};

const settingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  coordinateFormat: 'utm',
  manualCoordinateEntryFormat: 'utm',
  mediaSyncSetting: null,
  actions: {
    setCoordinateFormat: coordinateFormat => set({coordinateFormat}),
    setManualCoordinateEntryFormat: coordinateFormat =>
      set({manualCoordinateEntryFormat: coordinateFormat}),
    setMediaSyncSetting: mediaSyncSetting => set({mediaSyncSetting}),
  },
});

export const usePersistedSettings = createPersistedState(
  settingsSlice,
  'Settings',
);

export const usePersistedSettingsAction = () =>
  usePersistedSettings(store => store.actions);
