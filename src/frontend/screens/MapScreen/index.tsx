import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import debug from 'debug';

import MapView from '../../sharedComponents/Map/MapView';
import {Loading} from '../../components/Loading';
// import { useDraftObservation } from "../../hooks/useDraftObservation";
// import { useSelectedMapStyle } from "../../hooks/useSelectedMapStyle";
// import ObservationsContext from "../../context/ObservationsContext";
// import LocationContext from "../../context/LocationContext";
import {AddButton} from '../../sharedComponents/AddButton';

import {BackgroundMapSelector} from './BackgroundMapSelector';
// import {IconButton} from "../../sharedComponents/AddButton";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {MEDIUM_GREY} from '../../lib/styles';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
// import { useExperiments } from "../../hooks/useExperiments";
import {NativeHomeTabsNavigationProps} from '../../sharedTypes';

const log = debug('mapeo:MapScreen');

const MOCK_LOCATION = {
  // If available, details of the current position
  position: {
    coords: {
      latitude: 0,
      longitude: 0,
    },
    // The timestamp of when the current position was obtained
    timestamp: Date.parse(new Date().toDateString()),
  },
};

export const MapScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<'Map'>) => {
  // const [, { newDraft }] = useDraftObservation();
  // const selectedMapStyle = useSelectedMapStyle();

  // const [experiments] = useExperiments();

  const sheetRef = React.useRef<BottomSheetMethods>(null);

  // const [{ observations }] = React.useContext(ObservationsContext);
  // const location = React.useContext(LocationContext);

  const handleObservationPress = React.useCallback(
    (observationId: string) =>
      navigation.navigate('Observation', {observationId}),
    [navigation],
  );

  const handleAddPress = () => {
    log('pressed add button');
  };

  return (
    <View style={styles.container}>
      <MapView
        location={MOCK_LOCATION}
        // observations={observations}
        // onPressObservation={handleObservationPress}
        // styleURL={selectedMapStyle.styleUrl}
        // isOfflineFallback={selectedMapStyle.isOfflineFallback}
      />
      <AddButton testID="addButtonMap" onPress={handleAddPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  mapSelectorButtonContainer: {
    position: 'absolute',
    top: 100,
    right: 10,
  },
  mapSelectorButton: {backgroundColor: '#fff', borderRadius: 50},
});
