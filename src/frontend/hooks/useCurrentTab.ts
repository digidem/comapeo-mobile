import {
  useNavigation,
  useRoute,
  EventArg,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {useGPSModalContext} from '../contexts/GPSModalContext';
import {TabName} from '../Navigation/ScreenGroups/AppScreens';
import {useNavigationStore} from './useNavigationStore';

export const useCurrentTab = () => {
  const {setCurrentTab} = useNavigationStore();
  const navigation = useNavigation();
  const route = useRoute();
  const {bottomSheetRef} = useGPSModalContext();

  const handleTabPress = ({
    target,
    preventDefault,
  }: EventArg<'tabPress', true, undefined>) => {
    const targetTab = target?.split('-')[0];
    if (targetTab === 'Tracking') {
      preventDefault();
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }
    const currentTab = getFocusedRouteNameFromRoute(route);
    if (currentTab === 'Camera') {
      navigation.navigate('Map' as never);
    }
    setCurrentTab((target?.split('-')[0] || 'Map') as unknown as TabName);
  };

  return {handleTabPress};
};
