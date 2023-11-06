import {type StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';

type ProjectIdSlice = {
  projectId?: string;
  setProjectId: (id?: string) => void;
};

const projectIdSlice: StateCreator<ProjectIdSlice> = (set, get) => ({
  projectId: undefined,
  setProjectId: projectId => set({projectId}),
});

export const usePersistedProjectId = createPersistedState(
  projectIdSlice,
  'ActiveProjectId',
);
