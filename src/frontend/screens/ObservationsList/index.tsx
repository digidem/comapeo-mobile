import * as React from 'react';
import {View, FlatList, Dimensions, StyleSheet} from 'react-native';
import {ObservationListItem} from './ObservationListItem';
import ObservationEmptyView from './ObservationsEmptyView';

import {Observation} from '@mapeo/schema';
import {NativeHomeTabsNavigationProps} from '../../sharedTypes';
import {useAllObservations} from '../../hooks/useAllObservations';
import {MessageDescriptor, defineMessages} from 'react-intl';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {ObservationsListBarIcon} from '../../Navigation/Tab/TabBar/ObservationsListTabBarIcon';
import {ObservationListHeaderLeft} from './ObservationListHeaderLeft';

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

const getItemLayout = (_data: unknown, index: number) => ({
  length: OBSERVATION_CELL_HEIGHT,
  offset: OBSERVATION_CELL_HEIGHT * index,
  index,
});

const keyExtractor = (item: Observation) => item.docId;

export const ObservationsList: React.FC<
  NativeHomeTabsNavigationProps<'ObservationsList'>
> & {
  navTitle: MessageDescriptor;
} = ({navigation}) => {
  const observations = useAllObservations();

  const rowsPerWindow = Math.ceil(
    (Dimensions.get('window').height - 65) / OBSERVATION_CELL_HEIGHT,
  );

  if (!observations.length) {
    return (
      <ObservationEmptyView
        onPressBack={() => navigation.navigate('Home', {screen: 'Map'})}
      />
    );
  }

  return (
    <View style={styles.container} testID="observationsListView">
      <FlatList
        initialNumToRender={rowsPerWindow}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        style={styles.container}
        windowSize={3}
        removeClippedSubviews
        renderItem={({item, index}) => {
          return (
            <ObservationListItem
              key={item.docId}
              testID={`observationListItem:${index}`}
              observation={item}
              style={styles.listItem}
              onPress={() =>
                navigation.navigate('Observation', {observationId: item.docId})
              }
            />
          );
        }}
        data={observations}
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
