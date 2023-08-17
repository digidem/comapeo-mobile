import {create} from 'zustand';
import {StateStorage, persist, createJSONStorage} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

type PersistedStoreKey = 'test' | 'another'

const MMKVZustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

type PersistedStateCreator<T> = {
  state: T | Promise<T>;
  setState: (newState: T) => void;
};

type migrationOptions<S> = {
  version:number, 
  migrateFunction:(persistedState:unknown, versionOfPersistedState:number)=>S|Promise<S>
}

/**
 * @param {PersistedStoreKey} persistedStoreKey is a hardcoded string located in the type:`PersistedStoreKey` (`usePersistedStore.ts`). If you want to create a new persisted store, add the key to the `PersistedStoreKey` type.
 * 
 */
export function createPersistedState(persistedStoreKey: PersistedStoreKey) {
  /**
   * 
   * @param initialOrNewState This is the object/string/number that is going to be stored in persisted state. 
   * @param version If you expect this state to change, include a version number. If the version number changed, the migrate function callback will be called, which will allow you to merge the old state with the new state.
   * @param migrateFunction If the version number has changed, this callback will provide you with the previous object stored in persisted state, and the version number of that previous object. You will need to do a check that the previously stored object version matched the newly stored object. If they do not match, you will need to return a new object that has rectified the differences
   * @returns 
   */
  return function usePersistedStore<T>(initialOrNewState: T, options?:migrationOptions<T>) {
    const persistedStore = create<
      PersistedStateCreator<T>,
      [['zustand/persist', PersistedStateCreator<T>]]
    >(
      persist(
        set => ({
          state: initialOrNewState,
          setState: state => set({state}),
        }),
        {
          partialize:(state)=>state.state,
          version:options? options.version : undefined,
          // @ts-ignore This is a typing problem with zustand. According to their docs, and through testing, the migrate function should just return the state, and does not require the state setter. But the typescript
          migrate:options? (persistedState, version)=>{
            if(typeof persistedState === "object" && !!persistedState && "state" in persistedState)
            {
              return options.migrateFunction(persistedState, version)
            }
            throw new Error("nosdfaklsdf")
          }:undefined,
          name: persistedStoreKey,
          storage: createJSONStorage(() => MMKVZustandStorage),
        },
      ),
    )
    return persistedStore(store => [store.state, store.setState] as const);
  };


}

