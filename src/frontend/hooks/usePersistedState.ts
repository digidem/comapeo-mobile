import { create } from 'zustand'
import { StateStorage, persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

type PersistedStoreKey = 'test'

const MMKVZustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value)
  },
  getItem: (name) => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return storage.delete(name)
  },
}

type PersistedStateCreator<T> = {
    state:T,
    setState:(newState:T)=>void
}

/**
 * @param {PersistedStoreKey} persistedStoreKey is a hardcoded string located in the type:`PersistedStoreKey`  (`usePersistedStore.ts`). If you want to create a new persisted store, add the key to the `PersistedStoreKey` type.
 */
export function createPersistedState(persistedStoreKey:PersistedStoreKey){

    return function usePersistedStore<T>(initialState:T){
        const persistedStore = create<PersistedStateCreator<T>,[["zustand/persist",PersistedStateCreator<T>]]>(
            persist(
                (set) => ({
                    state:initialState,
                    setState: state => set({state})
                }),
                {
                    name:persistedStoreKey,
                    storage:createJSONStorage(()=>MMKVZustandStorage)
                }
            )
        )
        return persistedStore(store=>[store.state, store.setState] as const)
    } 

}


