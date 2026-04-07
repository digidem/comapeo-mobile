import * as React from 'react';
import {View, FlatList, Dimensions, StyleSheet} from 'react-native';
import {Observation, Track} from '@comapeo/schema';
import {MessageDescriptor, defineMessages} from 'react-intl';
import {useFocusEffect} from '@react-navigation/native';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {ObservationListItem} from './ObservationListItem';
import {ObservationEmptyView} from './ObservationsEmptyView';
import {NativeHomeTabsNavigationProps} from '../../sharedTypes/navigation';
import {WHITE} from '../../lib/styles';
import {TrackListItem} from './TrackListItem';
import {useObservations} from '../../hooks/server/observations';
import {useTracks} from '../../hooks/server/track';
import {useAuthContext} from '../../contexts/AuthContext';
import {useEarlyAccessState} from '../../contexts/EarlyAccessContext';
import {ObservationFilterToggle} from './ObservationFilterToggle';

const m = defineMessages({
  loading: {
    id: 'screens.ObservationsList.loading',
    defaultMessage:
      'Loading… this can take a while after synchronizing with a new device',
    description: 'message shown whilst observations are loading',
  },
  error: {
    id: 'screens.ObservationsList.error',
    defaultMessage:
      'Error loading observations. Try quitting and restarting CoMapeo.',
    description:
      'message shown when there is an unexpected error when loading observations',
  },
  observationListTitle: {
    id: 'screens.ObservationList.observationListTitle',
    defaultMessage: 'Observations',
    description: 'Title of screen with list of observations',
  },
});

const OBSERVATION_CELL_HEIGHT = 80;
const ONE_HOUR = 60 * 60 * 1000;

function getItemLayout(data: unknown, index: number) {
  return {
    length: OBSERVATION_CELL_HEIGHT,
    offset: OBSERVATION_CELL_HEIGHT * index,
    index,
  };
}

const keyExtractor = (item: Observation | Track) => item.docId;

export const ObservationsList: React.FC<
  NativeHomeTabsNavigationProps<'ObservationsList'>
> & {
  navTitle: MessageDescriptor;
} = ({navigation}) => {
  const {data: observations} = useObservations();
  const {data: tracks} = useTracks();
  const {authState} = useAuthContext();
  const isEarlyAccessEnabled = useEarlyAccessState(s => s.isEarlyAccessEnabled);
  const {data: deviceInfo} = useOwnDeviceInfo();

  const [filterMode, setFilterMode] = React.useState<'all' | 'mine'>('all');
  const lastInteractionRef = React.useRef<number | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (
        lastInteractionRef.current !== null &&
        Date.now() - lastInteractionRef.current > ONE_HOUR
      ) {
        setFilterMode('all');
        lastInteractionRef.current = null;
      }
    }, []),
  );

  React.useEffect(() => {
    if (!isEarlyAccessEnabled) {
      setFilterMode('all');
      lastInteractionRef.current = null;
    }
  }, [isEarlyAccessEnabled]);

  function handleFilterModeChange(mode: 'all' | 'mine') {
    setFilterMode(mode);
    lastInteractionRef.current = Date.now();
  }

  const rowsPerWindow = Math.ceil(
    (Dimensions.get('window').height - 65) / OBSERVATION_CELL_HEIGHT,
  );

  const filteredData = React.useMemo(() => {
    const allData = [...observations, ...tracks];

    if (!isEarlyAccessEnabled || filterMode === 'all') {
      return allData.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    const myDeviceId = deviceInfo?.deviceId;
    const filtered = allData.filter(
      item => 'createdBy' in item && item.createdBy === myDeviceId,
    );

    return filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [
    observations,
    tracks,
    isEarlyAccessEnabled,
    filterMode,
    deviceInfo?.deviceId,
  ]);

  if ((!observations.length && !tracks.length) || authState === 'obscured') {
    return (
      <ObservationEmptyView
        onPressBack={() => navigation.popTo('Home', {screen: 'Map'})}
      />
    );
  }

  return (
    <View style={styles.container} testID="OBS.list-scrn">
      {isEarlyAccessEnabled && (
        <ObservationFilterToggle
          filterMode={filterMode}
          onFilterModeChange={handleFilterModeChange}
        />
      )}
      {/* re: https://github.com/digidem/comapeo-mobile/issues/586  */}
      <FlatList
        initialNumToRender={rowsPerWindow}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        style={styles.container}
        windowSize={3}
        removeClippedSubviews
        renderItem={({item, index}) => {
          switch (item.schemaName) {
            case 'observation':
              return (
                <ObservationListItem
                  key={item.docId}
                  testID={`observationListItem:${index}`}
                  observation={item}
                  style={styles.listItem}
                  onPress={() =>
                    navigation.navigate('Observation', {
                      observationId: item.docId,
                    })
                  }
                />
              );
            case 'track':
              return (
                <TrackListItem
                  key={item.docId}
                  testID={`trackListItem:${index}`}
                  track={item}
                  style={styles.listItem}
                  onPress={() => {
                    navigation.navigate('Track', {trackId: item.docId});
                  }}
                />
              );
          }
        }}
        data={filteredData}
      />
    </View>
  );
};

ObservationsList.navTitle = m.observationListTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listItem: {
    height: OBSERVATION_CELL_HEIGHT,
  },
});
