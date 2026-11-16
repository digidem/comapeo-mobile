import {create} from 'zustand';

interface RefreshTokenStoreSlice {
  value: number;
  actions: {
    refresh: () => void;
  };
}

/**
 * Factory for creating a bound store instance and return its relevant hooks,
 * which allows the creation of isolated stores to account for contextual needs.
 */
export function createRefreshTokenStore(initialValue?: number) {
  const useRefreshTokenStore = create<RefreshTokenStoreSlice>(set => {
    return {
      value: typeof initialValue === 'number' ? initialValue : Date.now(),
      actions: {
        refresh: () => {
          set({value: Date.now()});
        },
      },
    };
  });

  return {
    useRefreshToken: () => {
      return useRefreshTokenStore(valueSelector);
    },
    useRefreshTokenActions: () => {
      return useRefreshTokenStore(actionsSelector);
    },
  };
}

function valueSelector(state: RefreshTokenStoreSlice) {
  return state.value;
}

function actionsSelector(state: RefreshTokenStoreSlice) {
  return state.actions;
}
