import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useLayoutEffect} from 'react';
import {BackHandler} from 'react-native';

import {useNavigationFromRoot} from './useNavigationWithTypes';

// On iOS back swipe runs `onBack` and pops the screen and visibly re-adds
// it, so it is disabled outright. Just use the header button on iOS for the same effect.
export const useReplaceBackNavigation = (onBack: () => void) => {
  const navigation = useNavigationFromRoot();

  useLayoutEffect(() => {
    navigation.setOptions({gestureEnabled: false});
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onBack();
          return true;
        },
      );

      return () => subscription.remove();
    }, [onBack]),
  );
};
