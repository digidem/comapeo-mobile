import {usePreventRemove, useRoute} from '@react-navigation/native';
import {Platform} from 'react-native';

import {useNavigationFromRoot} from './useNavigationWithTypes';

// `BackHandler` is Android-only. iOS's back swipe is caught in the navigator
export const usePreventBackSwipe = (onBackSwipe: () => void) => {
  const navigation = useNavigationFromRoot();
  const {key} = useRoute();

  usePreventRemove(Platform.OS === 'ios', ({data}) => {
    const isBackSwipe =
      data.action.type === 'POP' && data.action.source === key;

    if (isBackSwipe) {
      onBackSwipe();
      return;
    }

    navigation.dispatch(data.action);
  });
};
