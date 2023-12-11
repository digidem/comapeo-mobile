import NetInfo from '@react-native-community/netinfo';

/**
 * @returns name of wifi or null if user is not connected to wifi
 */
export const useWifiName = () => {
  // netInfo.type will not be 'wifi' if the user is connected to a router that does not connect to the internet (common use case). So intead we look for an ssid.
  const netInfo = NetInfo.useNetInfo();

  return netInfo.details && 'ssid' in netInfo.details
    ? (netInfo.details.ssid as string)
    : null;
};
