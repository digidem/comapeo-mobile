import {useFocusEffect} from '@react-navigation/native';
import {useState, useCallback} from 'react';
import {BackHandler} from 'react-native';
import {RootStackParamsList} from '../sharedTypes/navigation';

export const useOpenDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // enables android back button to close drawer
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (drawerOpen) {
          setDrawerOpen(false);
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [drawerOpen]),
  );

  return [drawerOpen, setDrawerOpen] as const;
};
