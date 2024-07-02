import {useNetInfo} from '@react-native-community/netinfo';

/**
 * Returns `true` if the internet *might* be reachable. If we're not sure,
 * returns `true`.
 *
 * Uses the device's internet reachability API.
 */
export function useInternetMightBeReachable(): boolean {
  const {isInternetReachable} = useNetInfo();
  return isInternetReachable !== false;
}
