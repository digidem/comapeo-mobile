import * as React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
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
import {usePresetsQuery} from '../../hooks/server/presets';
import {matchPreset} from '../../lib/utils';

const m = defineMessages({
  observationListTitle: {
    id: 'screens.ObservationList.observationListTitle',
    defaultMessage: 'Observations',
    description: 'Title of screen with list of observations',
  },
});

const ONE_HOUR = 60 * 60 * 1000;

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
  const {data: allPresets} = usePresetsQuery();
  const myDeviceId = deviceInfo?.deviceId;

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

  function handleFilterModeChange(mode: 'all' | 'mine') {
    setFilterMode(mode);
    lastInteractionRef.current = mode === 'mine' ? Date.now() : null;
  }

  const filteredData = React.useMemo(() => {
    const allData = [...observations, ...tracks];

    if (!isEarlyAccessEnabled || filterMode === 'all') {
      return allData.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    const filtered = allData.filter(
      item => 'createdBy' in item && item.createdBy === myDeviceId,
    );

    return filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [observations, tracks, isEarlyAccessEnabled, filterMode, myDeviceId]);

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
        keyExtractor={keyExtractor}
        style={styles.container}
        windowSize={7}
        updateCellsBatchingPeriod={20}
        renderItem={({item, index}) => {
          const isMine = 'createdBy' in item && item.createdBy === myDeviceId;
          switch (item.schemaName) {
            case 'observation':
              return (
                <ObservationListItem
                  key={item.docId}
                  testID={`observationListItem:${index}`}
                  observation={item}
                  preset={matchPreset(item.tags, allPresets)}
                  isMine={isMine}
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
                  allPresets={allPresets}
                  isMine={isMine}
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
    minHeight: 80,
  },
});
