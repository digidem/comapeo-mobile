const connectedState = {
  type: 'wifi',
  isConnected: true,
  isInternetReachable: true,
  details: {
    ssid: null,
    bssid: null,
    strength: null,
    ipAddress: null,
    subnet: null,
    frequency: null,
    isConnectionExpensive: false,
    linkSpeed: null,
    rxLinkSpeed: null,
    txLinkSpeed: null,
  },
};

export default {
  fetch: () => Promise.resolve(connectedState),
  refresh: () => Promise.resolve(connectedState),
  configure: jest.fn(),
  addEventListener: () => jest.fn(),
  useNetInfo: jest.fn(),
};
