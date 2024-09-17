import {type MapeoClientApi} from '@comapeo/ipc';
import {useEffect} from 'react';
import {useAppState} from '@react-native-community/hooks';

export const useOnBackgroundedAndForegrounded = (api: MapeoClientApi): void => {
  const isAppActive = useAppState() === 'active';
  useEffect(() => {
    if (isAppActive) {
      api.onForegrounded();
    } else {
      api.onBackgrounded();
    }
  }, [api, isAppActive]);
};
