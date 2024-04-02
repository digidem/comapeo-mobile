import { useSyncExternalStore } from 'react'
import {
  useLocalDiscoveryController,
  type LocalDiscoveryState,
} from '../contexts/LocalDiscoveryContext'

/**
 * Hook to subscribe to the current state of local peer discovery. Optionally
 * pass a selector to subscribe to a subset of the state (to avoid unnecessary
 * re-renders)
 *
 * @example
 * ```
 * const wifiLinkSpeed = useSync(state => state.wifiLinkSpeed);
 * ```
 *
 * @param selector Select a subset of the state to subscribe to. Defaults to
 * return the entire state. Be careful returning an object - if it's not the
 * same value (as compared by `Object.is`) as the previous value, the component
 * will re-render, e.g. a selector that does `return { status, ssid }` will
 * cause a re-render every time any state property updates, because it is
 * creating a new object every time.
 */

export function useLocalDiscoveryState<
  T extends (state: LocalDiscoveryState) => any = (
    state: LocalDiscoveryState,
  ) => LocalDiscoveryState,
>(selector: T = ((state: LocalDiscoveryState) => state) as T): ReturnType<T> {
  const { subscribe, getSnapshot } = useLocalDiscoveryController()
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()))
}
