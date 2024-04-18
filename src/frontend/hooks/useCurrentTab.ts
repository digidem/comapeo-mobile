import {EventArg} from '@react-navigation/native';
import {useGPSModalContext} from '../contexts/GPSModalContext';
import {useNavigationStore} from './useNavigationStore';
import {TabName} from '../Navigation/types';

export const useCurrentTab = () => {
  const {setCurrentTab} = useNavigationStore();
  const {bottomSheetRef} = useGPSModalContext();

  const handleTabPress = ({target}: EventArg<'tabPress', true, undefined>) => {
    const targetTab = target?.split('-')[0];
    if (targetTab === TabName.Tracking) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }
    setCurrentTab(targetTab as unknown as TabName);
  };

  return {handleTabPress};
};
