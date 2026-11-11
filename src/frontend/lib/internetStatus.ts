import {Platform} from 'react-native';
import {type NetInfoState} from '@react-native-community/netinfo';

export type InternetStatus = 'online' | 'offline' | 'unknown';

/**
 * Android reports internet reachability natively. iOS does not, so
 * NetInfo can only get it by polling an external URL.
 * On iOS whether a network route exists is the most we can know.
 */
export function getInternetStatus(state: NetInfoState): InternetStatus {
  const isOnline =
    Platform.OS === 'android' ? state.isInternetReachable : state.isConnected;
  if (typeof isOnline !== 'boolean') return 'unknown';
  return isOnline ? 'online' : 'offline';
}
