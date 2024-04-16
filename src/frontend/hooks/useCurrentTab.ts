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
      navigation.navigate('Map' as never);
    } else {
      bottomSheetRef.current?.close();
    }
    setCurrentTab((target?.split('-')[0] || 'Map') as unknown as TabName);
  };

  return {handleTabPress};
};
