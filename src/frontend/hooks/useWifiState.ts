import {useEffect, useState} from 'react';
import {NativeModules, NativeEventEmitter} from 'react-native';

const {WifiModule} = NativeModules;

type WifiState = Readonly<{
  ssid: null | string;
  ipAddress: null | string;
}>;

const isNullOrString = (value: unknown): value is null | string =>
  value === null || typeof value === 'string';

const parseState = (value: unknown): WifiState => {
  if (
    value &&
    typeof value === 'object' &&
    'ssid' in value &&
    'ipAddress' in value &&
    isNullOrString(value.ssid) &&
    isNullOrString(value.ipAddress)
  ) {
    return {ssid: value.ssid, ipAddress: value.ipAddress};
  }
  throw new Error('Invalid wifi state from native module');
};

export const useWifiState = () => {
  const [result, setResult] = useState<WifiState>({
    ssid: null,
    ipAddress: null,
  });

  useEffect(() => {
    const emitter = new NativeEventEmitter(WifiModule);
    const listener = emitter.addListener('change', (rawState: unknown) => {
      setResult(parseState(rawState));
    });
    return () => {
      listener.remove();
    };
  }, []);

  return result;
};
