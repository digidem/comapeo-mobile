import {useNavigation, EventArg} from '@react-navigation/native';
import {useGPSModalContext} from '../contexts/GPSModalContext';
import {useNavigationStore} from './useNavigationStore';
import {TabName} from '../Navigation/types';

export const useCurrentTab = () => {
  const {setCurrentTab} = useNavigationStore();
  const navigation = useNavigation();
  const {bottomSheetRef} = useGPSModalContext();

  const handleTabPress = ({
    target,
    preventDefault,
  }: EventArg<'tabPress', true, undefined>) => {
    const targetTab = target?.split('-')[0];
    if (targetTab === TabName.Tracking) {
      preventDefault();
      bottomSheetRef.current?.present();
      navigation.navigate(TabName.Map as never);
    } else {
      bottomSheetRef.current?.close();
    }
    setCurrentTab((targetTab || 'Map') as TabName);
  };

  return {handleTabPress};
};
