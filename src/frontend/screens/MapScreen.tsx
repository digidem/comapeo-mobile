import * as React from 'react';
import {View} from 'react-native';
import debug from 'debug';

import {MapView} from '../sharedComponents/Map/MapView';
// import {Loading} from '../../components/Loading';
// import { useDraftObservation } from "../../hooks/useDraftObservation";
// import { useSelectedMapStyle } from "../../hooks/useSelectedMapStyle";
// import ObservationsContext from "../../context/ObservationsContext";
import {AddButton} from '../sharedComponents/AddButton';

// import {BackgroundMapSelector} from './BackgroundMapSelector';
// import {IconButton} from "../../sharedComponents/AddButton";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
// import { useExperiments } from "../../hooks/useExperiments";
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

  const sheetRef = React.useRef<BottomSheetMethods>(null);

  // const handleObservationPress = React.useCallback(
  //   (observationId: string) =>
  //     navigation.navigate('Observation', {observationId}),
  //   [navigation],
  // );

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
