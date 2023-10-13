import {StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';

type NavStateSlice = {
  projectId: string | null;
  actions: {
    setProjectId: (newId: string) => void;
  };
};

const navStateSlice: StateCreator<NavStateSlice> = (set, get) => ({
  projectId: null,
  actions: {
    setProjectId: projectId => set({projectId}),
  },
});

export const usePersistedNavigation = createPersistedState(
  navStateSlice,
  '@Navigation',
);
