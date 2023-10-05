import * as React from 'react';
import {View} from 'react-native';
import debug from 'debug';

import {MapView} from '../sharedComponents/Map/MapView';
import {AddButton} from '../sharedComponents/AddButton';
import {NativeHomeTabsNavigationProps} from '../sharedTypes';
import {useLocationContext} from '../contexts/LocationContext';
import {useIsFullyFocused} from '../hooks/useIsFullyFocused';
import {useDraftObservation} from '../hooks/useDraftObservation';

const log = debug('mapeo:MapScreen');

export const MapScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<'Map'>) => {
  const {position, provider} = useLocationContext();
  const isFocused = useIsFullyFocused();
  const {newDraft} = useDraftObservation();

  const handleAddPress = () => {
    newDraft();
    navigation.navigate('CategoryChooser');
  };

  const coords = React.useMemo(() => {
    if (!position?.coords?.latitude) return undefined;
    if (!position?.coords?.longitude) return undefined;

    return [position.coords.longitude, position.coords.latitude];
  }, [position]);

  return (
    <View style={{flex: 1}}>
      <MapView
        coords={coords}
        isFocused={isFocused}
        locationServiceEnabled={provider && provider.locationServicesEnabled}
      />
      <AddButton testID="addButtonMap" onPress={handleAddPress} />
    </View>
  );
};
