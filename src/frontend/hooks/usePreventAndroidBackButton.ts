import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {BackHandler} from 'react-native';

export const usePreventAndroidBackButton = () => {
  return useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );
};
