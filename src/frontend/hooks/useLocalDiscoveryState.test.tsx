import {renderHook} from '@testing-library/react-native';
import {useLocalDiscoveryState} from './useLocalDiscoveryState';
import {ApiProvider, ApiProviderProps} from '../contexts/ApiContext';
import {MapeoClientApi} from '@mapeo/ipc';

const api = {
  startLocalPeerDiscovery: jest.fn(),
  stopLocalPeerDiscovery: jest.fn(),
} as unknown as MapeoClientApi;

const Providers = ({children}: {children: React.ReactNode}) => {
  return <ApiProvider api={api}>{children}</ApiProvider>;
};

test('returns local discovery state', () => {
  const {result} = renderHook(() => useLocalDiscoveryState(), {
    wrapper: Providers,
  });
  expect(result.current).toEqual({
    status: 'stopped',
    ssid: null,
    wifiStatus: 'unknown',
    wifiConnection: 'unknown',
    wifiLinkSpeed: null,
  });
  expect(api.startLocalPeerDiscovery).toHaveBeenCalledTimes(0);
});
