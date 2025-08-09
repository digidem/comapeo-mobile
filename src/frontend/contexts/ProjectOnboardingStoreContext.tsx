import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';

type ProjectOnboardingState = {
  hasCompleted: boolean;
};

function createInitialState(): ProjectOnboardingState {
  return {hasCompleted: false};
}

export function createProjectOnboardingStore({persist = true} = {}) {
  let instance: StoreApi<ProjectOnboardingState>;

  if (persist) {
    instance = createStore(
      createPersistedState<ProjectOnboardingState>(() => createInitialState(), {
        name: 'ProjectOnboarding',
        storage: createJSONStorage(() => MMKVZustandStorage),
        version: 0,
      }),
    );
  } else {
    instance = createStore<ProjectOnboardingState>(() => createInitialState());
  }

  const actions = {
    setCompleted: (value: boolean) => {
      instance.setState({hasCompleted: value});
    },
  };

  return {instance, actions};
}

export type ProjectOnboardingStore = ReturnType<
  typeof createProjectOnboardingStore
>;

const ProjectOnboardingStoreContext =
  createContext<ProjectOnboardingStore | null>(null);

export const ProjectOnboardingStoreProvider =
  ProjectOnboardingStoreContext.Provider;

function useProjectOnboardingStoreContext() {
  const value = useContext(ProjectOnboardingStoreContext);
  if (!value) throw new Error('Must set up the ProjectOnboardingStoreProvider');
  return value;
}

export function useHasCompletedProjectOnboarding(): boolean {
  const {instance} = useProjectOnboardingStoreContext();
  return useStore(instance).hasCompleted;
}

export function useProjectOnboardingActions() {
  const {actions} = useProjectOnboardingStoreContext();
  return actions;
}
