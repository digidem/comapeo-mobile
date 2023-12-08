import {useFocusEffect} from '@react-navigation/native';
import {
  watchPositionAsync,
  hasServicesEnabledAsync,
  Accuracy,
} from 'expo-location';
import {useCallback, useState} from 'react';

const LOCATION_TIMEOUT = 10000;

export const useLocationProviderStatus = () => {
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let timeout: ReturnType<typeof setTimeout>;
      let ignore = false;
      const locationSubscriptionProm = watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
        },
        () => {
          if (ignore) return;
          setLocationServiceEnabled(prevValue =>
            !prevValue ? true : prevValue,
          );
          if (timeout) clearTimeout(timeout);
          setTimeout(async () => {
            if (!(await hasServicesEnabledAsync())) {
              setLocationServiceEnabled(false);
              return;
            }
          }, LOCATION_TIMEOUT);
        },
      );

      return () => {
        ignore = true;
        locationSubscriptionProm.then(sub => sub.remove());
        if (timeout) clearTimeout(timeout);
      };
    }, [setLocationServiceEnabled]),
  );

  return locationServiceEnabled;
};
