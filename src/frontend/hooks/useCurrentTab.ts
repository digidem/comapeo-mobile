import {EventArg} from '@react-navigation/native';
import {useGPSModalContext} from '../contexts/GPSModalContext';
import {useTabNavigationStore} from './useTabNavigationStore.ts';
import {TabName} from '../Navigation/types';

const tabNames: Set<TabName> = new Set([
  'Map',
  'Camera',
  'Tracking',
  'ObservationsList',
]);

const isTabName = (name: string | undefined): name is TabName => {
  return tabNames.has(name as TabName);
};

export const useCurrentTab = () => {
  const {setCurrentTab} = useTabNavigationStore();
  const {bottomSheetRef} = useGPSModalContext();

  const handleTabPress = ({target}: EventArg<'tabPress', true, undefined>) => {
    const targetTab = target?.split('-')[0];

    if (!isTabName(targetTab)) {
      throw new Error(
        `Invalid tab name: ${targetTab}, Makes sure tabNames array in useCurrentTab includes all possible names of tabs`,
      );
    }

    if (targetTab === 'Tracking') {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }
    setCurrentTab(targetTab as TabName);
  };

  return {handleTabPress};
};
