import {type StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';
import {CoordinateFormat} from '../../sharedTypes';

type SettingsSlice = {
  coordinateFormat: CoordinateFormat;
  actions: {
    setCoordinateFormat: (coordinateFormat: CoordinateFormat) => void;
  };
};

const settingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  coordinateFormat: 'utm',
  actions: {
    setCoordinateFormat: coordinateFormat => set({coordinateFormat}),
  },
});

export const usePersistedSettings = createPersistedState(
  settingsSlice,
  'Settings',
);

export const usePersistedSettingsAction = () =>
  usePersistedSettings(store => store.actions);
