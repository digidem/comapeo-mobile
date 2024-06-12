import * as React from 'react';
import {View, FlatList, Dimensions, StyleSheet} from 'react-native';
import {ObservationListItem} from './ObservationListItem';
import ObservationEmptyView from './ObservationsEmptyView';

import {Observation, Track} from '@mapeo/schema';
import {MessageDescriptor, defineMessages} from 'react-intl';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {ObservationsListBarIcon} from '../../Navigation/Tab/TabBar/ObservationsListTabBarIcon';
import {ObservationListHeaderLeft} from './ObservationListHeaderLeft';
import {NativeHomeTabsNavigationProps} from '../../sharedTypes/navigation';
import {NoProjectWarning} from './NoProjectWarning';
import {LIGHT_GREY, WHITE} from '../../lib/styles';
import {useAllProjects} from '../../hooks/server/projects';
import {Loading} from '../../sharedComponents/Loading';
import {TrackListItem} from './TrackListItem';
import {useObservations} from '../../hooks/server/observations';
import {useTracks} from '../../hooks/server/track';

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
      'Error loading observations. Try quitting and restarting Mapeo.',
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
  const {data, isPending} = useAllProjects();

  const rowsPerWindow = Math.ceil(
    (Dimensions.get('window').height - 65) / OBSERVATION_CELL_HEIGHT,
  );

  if (!observations.length && !tracks.length) {
    return (
      <ObservationEmptyView
        onPressBack={() => navigation.navigate('Home', {screen: 'Map'})}
      />
    );
  }

  return (
    <View style={styles.container} testID="observationsListView">
      {isPending ? (
        <Loading />
      ) : data && data.length <= 1 ? (
        <NoProjectWarning style={{margin: 20}} />
      ) : null}
      <FlatList
        initialNumToRender={rowsPerWindow}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        style={[
          styles.container,
          {borderTopColor: LIGHT_GREY, borderTopWidth: 1},
        ]}
        windowSize={3}
        removeClippedSubviews
        renderItem={({item, index}) => {
          switch (item.schemaName) {
            case 'observation':
              return (
                <ObservationListItem
                  key={item.docId}
                  testID={`observationListItem:${index}`}
                  observation={item as Observation}
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
                  testID={`trackListItem:${index}`}
                  track={item as Track}
                  style={styles.listItem}
                  onPress={() => {}}
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

export function createNavigationOptions(
  formatMessage: (title: MessageDescriptor) => string,
): BottomTabNavigationOptions {
  return {
    tabBarIcon: ObservationsListBarIcon,
    headerLeft: ObservationListHeaderLeft,
    headerTransparent: false,
    headerTitle: formatMessage(ObservationsList.navTitle),
    headerShadowVisible: true,
    headerStyle: {
      elevation: 15,
      shadowOpacity: 0,
      borderBottomWidth: 1,
    },
  };
}

ObservationsList.navTitle = m.observationListTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  listItem: {
    height: OBSERVATION_CELL_HEIGHT,
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});
