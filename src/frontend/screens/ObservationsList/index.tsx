import * as React from 'react';
import {View, FlatList, Dimensions, StyleSheet} from 'react-native';
import {ObservationListItem} from './ObservationListItem';
import {ObservationEmptyView} from './ObservationsEmptyView';

import {Observation, Track} from '@comapeo/schema';
import {MessageDescriptor, defineMessages} from 'react-intl';
import {NativeHomeTabsNavigationProps} from '../../sharedTypes/navigation';
import {VERY_LIGHT_GREY, WHITE} from '../../lib/styles';
import {useAllProjects} from '../../hooks/server/projects';
import {Loading} from '../../sharedComponents/Loading';
import {TrackListItem} from './TrackListItem';
import {useObservations} from '../../hooks/server/observations';
import {useTracks} from '../../hooks/server/track';
import {UIActivityIndicator} from 'react-native-indicators';
import {ProjectCard} from './ProjectCard';

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
  mappingOnYourOwn: {
    id: 'observationsList.ObservationListHeader.mappingOnYourOwn',
    defaultMessage: 'You’re mapping on your own.',
  },
  coordinator: {
    id: 'observationsList.ObservationListHeader.coordinator',
    defaultMessage: 'You’re a coordinator on this project.',
  },
  participant: {
    id: 'observationsList.ObservationListHeader.participant',
    defaultMessage: 'You’re a participant on this project.',
  },
});

const OBSERVATION_CELL_HEIGHT = 80;

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
  const {data: observations, isFetching} = useObservations();
  const {data: tracks} = useTracks();
  const {isPending} = useAllProjects();

  const rowsPerWindow = Math.ceil(
    (Dimensions.get('window').height - 65) / OBSERVATION_CELL_HEIGHT,
  );

  if (!observations.length && !tracks.length) {
    return (
      <ObservationEmptyView
        onPressBack={() => navigation.popTo('Home', {screen: 'Map'})}
      />
    );
  }

  return (
    <View style={styles.container} testID="OBS.list-scrn">
      {isPending ? <Loading /> : null}
      {/* re: https://github.com/digidem/comapeo-mobile/issues/586  */}
      {isFetching && <UIActivityIndicator style={{padding: 20, flex: 0}} />}
      <FlatList
        ListHeaderComponent={
          <View style={styles.projectCardContainer}>
            <ProjectCard />
          </View>
        }
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
        data={[...observations, ...tracks].sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : -1,
        )}
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
  projectCardContainer: {
    width: '100%',
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: VERY_LIGHT_GREY,
  },
});
