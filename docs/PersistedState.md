# Persisted State Architecture

For persisted state, we are migrating from using Zustand's [global store](https://zustand.docs.pmnd.rs/integrations/persisting-store-dat) to using [Zustand with React Context](https://tkdodo.eu/blog/zustand-and-react-context). This change improves testability by allowing us to inject temporary stores in place of persisted state, making it easier to manipulate data and perform isolated tests.

Following this pattern:

```tsx
import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {persist as createPersistedState} from 'zustand/middleware';

type BearState = {bears: number};

function createInitialState(): BearState {
  return {bears: 0};
}

const BEAR_STORE_PERSIST_KEY = 'bearStore';

export function createBearStore({persist = false}: {persist: boolean}) {
  let instance: StoreApi<BearState>;

  if (persist) {
    instance = createStore(
      createPersistedState(createInitialState, {name: BEAR_STORE_PERSIST_KEY}),
    );
  } else {
    instance = createStore(createInitialState);
  }

  const actions = {
    increasePopulation() {
      instance.setState(state => ({bears: state.bears + 1}));
    },
    removeAllBears: () => instance.setState({bears: 0}),
    updateBears: (newBears: number) => instance.setState({bears: newBears}),
  };

  return {instance, actions};
}

const BearStoreContext = createContext<ReturnType<
  typeof createBearStore
> | null>(null);

export const BearStoreProvider = ({instance, children}) => {
  return (
    <BearStoreContext.Provider value={instance}>
      {children}
    </BearStoreContext.Provider>
  );
};

// Shouldn't need to export this, just a helper for DRY
function useBearContext() {
  const value = useContext(BearStoreContext);
  if (!value) {
    throw new Error('Must set up the BearStoreProvider first');
  }
  return value;
}

export function useBearState(): BearState;
export function useBearState<T>(selector: (state: BearState) => T): T;
export function useBearState<T>(selector?: (state: BearState) => T) {
  const {store} = useBearContext();
  return useStore(store, selector!);
}

// No need for a selector because this is stable across renders
export function useBearActions() {
  const {actions} = useBearContext();
  return actions;
}
```

Main things to note:

- We are returning the store instance as `instance` but in the hooks we return the store state.
- In our implementation, actions are created separately from the instance. This differs from Zustand as their documentation suggests that the store should contain both the state (instance) and its actions. Zustand suggests:

```ts
type BearStore = {bears: number; addABear: () => void};

//When creating the store, we need to pass `addABear` into the persisted state
function createInitialState(set, get): BearState {
  return {bears: 0, addABear: () => set({bears: get().bears + 1})};
}
```

Instead, we are structuring our store so that the state (`instance`) and `actions` are defined separately. This allows us to manage actions independently (such as replacing the actions when needed) and makes it easier to set the initial state

- The `Provider` should take the store as props. This store should be instantiated outside of the React lifecycle. By doing so, we gain more flexibility, particularly in testing environments, where we can provide a temporary store instead of using the persisted state.
