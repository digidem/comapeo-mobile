import {Platform} from 'react-native';
import {
  NetInfoStateType,
  type NetInfoState,
} from '@react-native-community/netinfo';
import {getInternetStatus} from './internetStatus';

function netInfoState(
  isConnected: boolean | null,
  isInternetReachable: boolean | null,
): NetInfoState {
  return {
    type: NetInfoStateType.wifi,
    isConnected,
    isInternetReachable,
    details: {isConnectionExpensive: false},
  } as NetInfoState;
}

describe('on Android', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'android');
  });

  it('uses the natively reported reachability', () => {
    expect(getInternetStatus(netInfoState(true, true))).toBe('online');
    expect(getInternetStatus(netInfoState(true, false))).toBe('offline');
  });

  it('is unknown until reachability is reported', () => {
    expect(getInternetStatus(netInfoState(true, null))).toBe('unknown');
  });
});

describe('on iOS', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'ios');
  });

  it('uses the connection state, not reachability', () => {
    expect(getInternetStatus(netInfoState(true, false))).toBe('online');
    expect(getInternetStatus(netInfoState(false, false))).toBe('offline');
  });

  it('is unknown until a connection state is reported', () => {
    expect(getInternetStatus(netInfoState(null, false))).toBe('unknown');
  });
});
