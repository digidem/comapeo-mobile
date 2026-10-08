import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {BackHandler} from 'react-native';

import {useNavigationFromRoot} from './useNavigationWithTypes';

// `BackHandler` for android.
// iOS's disabling the gesture on navigation does the same.
export const usePreventBackNavigation = () => {
  const navigation = useNavigationFromRoot();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({gestureEnabled: false});

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, [navigation]),
  );
};
