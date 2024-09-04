import {type StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';
import {CoordinateFormat} from '../../sharedTypes';

type SettingsSlice = {
  coordinateFormat: CoordinateFormat;
  manualCoordinateEntryFormat: CoordinateFormat;
  syncSetting: 'previews' | 'everything';
  actions: {
    setCoordinateFormat: (coordinateFormat: CoordinateFormat) => void;
    setManualCoordinateEntryFormat: (
      coordinateFormat: CoordinateFormat,
    ) => void;
    setSyncSetting: (syncSetting: 'previews' | 'everything') => void;
  };
};

const settingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  coordinateFormat: 'utm',
  manualCoordinateEntryFormat: 'utm',
  syncSetting: 'everything',
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
