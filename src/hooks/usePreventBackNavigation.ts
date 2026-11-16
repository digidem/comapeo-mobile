import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useLayoutEffect} from 'react';
import {BackHandler} from 'react-native';

import {useNavigationFromRoot} from './useNavigationWithTypes';

// `BackHandler` for android.
// iOS's disabling the gesture on navigation does the same.
export const usePreventBackNavigation = () => {
  const navigation = useNavigationFromRoot();

  useLayoutEffect(() => {
    navigation.setOptions({gestureEnabled: false});
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, []),
  );
};
