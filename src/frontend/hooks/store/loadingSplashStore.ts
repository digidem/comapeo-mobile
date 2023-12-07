import {create} from 'zustand';

type isLoaded = {
  permissions: boolean;
  actions: {
    setIsLoaded: ({
      property,
      value,
    }: {
      property: isLoadedKeys;
      value: boolean;
    }) => void;
  };
};

type isLoadedKeys = keyof Omit<isLoaded, 'actions'>;

const isLoadedStore = create<isLoaded>((set, get) => ({
  permissions: false,
  actions: {
    setIsLoaded: ({property, value}) =>
      set(() => ({
        [property]: value,
      })),
  },
}));

export function useEverythingLoaded() {
  const permissions = isLoadedStore(store => store.permissions);
  return [permissions].every(v => v === true);
}

export function useIsLoadedActions() {
  return isLoadedStore(store => store.actions.setIsLoaded);
}
