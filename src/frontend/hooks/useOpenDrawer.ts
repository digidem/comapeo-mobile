import {useFocusEffect} from '@react-navigation/native';
import {useState, useCallback, useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useNavigationFromRoot} from './useNavigationWithTypes';
import {RootStackParamsList} from '../sharedTypes/navigation';

export const useOpenDrawer = ({
  screensToLeaveDrawerOpen,
}: {
  screensToLeaveDrawerOpen: (keyof RootStackParamsList)[];
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {addListener} = useNavigationFromRoot();

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

  useEffect(() => {
    const unsubscribe = addListener('state', e => {
      const screen = e.data.state.routes[e.data.state.index]?.name;
      if (!screen) return;

      if (screensToLeaveDrawerOpen.some(s => s === screen)) {
        return;
      }
      if (screen === 'Home' && drawerOpen) {
        return;
      }
      setDrawerOpen(false);
    });

    return unsubscribe;
  }, [addListener, drawerOpen]);

  return [drawerOpen, setDrawerOpen] as const;
};
