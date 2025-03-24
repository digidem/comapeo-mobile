import {type StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';
import {type CoordinateFormat} from '../../lib/coordinateFormat';

type SettingsSlice = {
  coordinateFormat: CoordinateFormat;
  manualCoordinateEntryFormat: CoordinateFormat;
  actions: {
    setCoordinateFormat: (coordinateFormat: CoordinateFormat) => void;
    setManualCoordinateEntryFormat: (
      coordinateFormat: CoordinateFormat,
    ) => void;
  };
};

const settingsSlice: StateCreator<SettingsSlice> = set => ({
  coordinateFormat: 'utm',
  manualCoordinateEntryFormat: 'utm',
  actions: {
    setCoordinateFormat: coordinateFormat => set({coordinateFormat}),
    setManualCoordinateEntryFormat: coordinateFormat =>
      set({manualCoordinateEntryFormat: coordinateFormat}),
  },
});

export const usePersistedSettings = createPersistedState(
  settingsSlice,
  'Settings',
);

export const usePersistedSettingsAction = () =>
  usePersistedSettings(store => store.actions);
