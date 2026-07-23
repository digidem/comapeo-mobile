import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';
import {useClientApi} from '@comapeo/core-react';
import {FullScreenCenteredLoader} from '../sharedComponents/FullScreenCenteredLoader';

type ActiveProjectIdState = {
  projectId?: string;
};

// NOTE: Do not change!
const STORAGE_KEY = 'ActiveProjectId' as const;

// Zustand's persist middleware and using `createJSONStorage()` assumes that states are represented as objects.
// Using a scalar value requires tedious workarounds that are more trouble than shaping the state according to Zustand's assumptions.
// https://github.com/pmndrs/zustand/blob/17e281fd75a8200e3598658e732b8b4a3055f0b1/src/middleware/persist.ts#L181-L184
function createInitialState(): ActiveProjectIdState {
  return {};
}

export function createActiveProjectIdStore({persist} = {persist: false}) {
  let store: StoreApi<ActiveProjectIdState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVStoreInitializer),
        version: 0,
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setActiveProjectId: (projectId: string) => {
      store.setState({projectId});
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type ActiveProjectIdStore = ReturnType<
  typeof createActiveProjectIdStore
>;

const ActiveProjectIdStoreContext = createContext<ActiveProjectIdStore | null>(
  null,
);

export const ActiveProjectIdStoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: ActiveProjectIdStore;
}) => {
  const {listProjects} = useClientApi();
  const [isInitialized, setIsInitialized] = useState(() =>
    Boolean(store.instance.getState().projectId),
  );

  useEffect(() => {
    if (isInitialized) return;

    listProjects()
      .then(projects => {
        if (!projects || projects.length === 0) {
          return;
        }

        const fallbackProjectId = projects[0]?.projectId;
        if (fallbackProjectId) {
          store.actions.setActiveProjectId(fallbackProjectId);
        }
      })
      .finally(() => {
        setIsInitialized(true);
      });
  }, [store, isInitialized, listProjects]);

  return !isInitialized ? (
    <FullScreenCenteredLoader />
  ) : (
    <ActiveProjectIdStoreContext value={store}>
      {children}
    </ActiveProjectIdStoreContext>
  );
};

function useActiveProjectIdStoreContext() {
  const value = useContext(ActiveProjectIdStoreContext);

  if (!value) {
    throw new Error('Must set up the ActiveProjectIdStoreContext');
  }

  return value;
}

export function useActiveProjectId(): string | undefined {
  const {instance} = useActiveProjectIdStoreContext();
  return useStore(instance).projectId;
}

export function useActiveProjectIdActions() {
  const {actions} = useActiveProjectIdStoreContext();
  return actions;
}
