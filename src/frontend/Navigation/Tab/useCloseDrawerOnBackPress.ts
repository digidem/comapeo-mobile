import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {BackHandler} from 'react-native';

export function useCloseDrawerOnBackPress({
  drawerOpen,
  closeDrawer,
}: {
  drawerOpen: boolean;
  closeDrawer: () => void;
}) {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!drawerOpen) return false;

        closeDrawer();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [drawerOpen, closeDrawer]),
  );
}
