import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {BLACK, DARK_GREY} from '../../lib/styles.ts';

import TrackIcon from '../../images/Track.svg';
import EditIcon from '../../images/Edit.svg';
import {FormattedMessage, MessageDescriptor, defineMessages} from 'react-intl';
import {useDeleteTrackMutation, useTrack} from '../../hooks/server/track.ts';
import {useObservations} from '../../hooks/server/observations.ts';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {MapPreview} from './MapPreview.tsx';
import {ObservationList} from './ObservationList.tsx';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet.tsx';
import {ActionButtons} from '../../sharedComponents/ActionButtons.tsx';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock.tsx';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

const m = defineMessages({
  title: {
    id: 'screens.Track.title',
    defaultMessage: 'Track',
    description:
      'Title of track screen showing (non-editable) view of observation with map',
  },
  deleteTitle: {
    id: 'screens.Track.deleteTitle',
    defaultMessage: 'Delete track?',
    description: 'Title of dialog asking confirmation to delete a track',
  },
  tracks: {
    id: 'screens.Track.tracks',
    defaultMessage: 'Tracks',
  },
});

export const TrackScreen: NativeNavigationComponent<'Track'> = ({
  route,
  navigation,
}) => {
  const isMine = false;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: isMine
        ? () => (
            <TouchableOpacity
              hitSlop={{top: 16, right: 16, bottom: 16, left: 16}}
              onPress={() => {
                // TODO: navigate to edit track screen
              }}>
              <EditIcon />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [navigation, isMine]);

  const {data: track} = useTrack(route.params.trackId);
  const {data: observations} = useObservations();
  const trackObservations = observations.filter(observation =>
    track.refs.some(ref => ref.id === observation.docId),
  );

  const deleteTrackMutation = useDeleteTrackMutation();

  function deleteTrack() {
    deleteTrackMutation.mutate(track.docId, {
      onSuccess: () => {
        navigation.pop();
      },
    });
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScreenContentWithDock
        contentContainerStyle={{padding: 0}}
        dockContainerStyle={{padding: 0}}
        dockContent={
          <ActionButtons
            handleDelete={deleteTrack}
            isMine={true}
            deleteMessage={m.deleteTitle}
          />
        }>
        <View>
          <MapPreview
            locationHistory={track.locations.map(({timestamp, coords}) => ({
              latitude: coords.latitude,
              longitude: coords.longitude,
              timestamp: parseInt(timestamp, 10),
            }))}
          />
          <View style={styles.trackTitleWrapper}>
            <TrackIcon />
            <Text style={styles.trackTitle}>
              <FormattedMessage {...m.tracks} />
            </Text>
          </View>
          <View style={styles.divider} />
          <ObservationList observations={trackObservations} />
          <View style={styles.divider} />
          <Text style={styles.text}>{track.tags.notes}</Text>
        </View>
      </ScreenContentWithDock>
      <ErrorBottomSheet
        error={deleteTrackMutation.error}
        clearError={deleteTrackMutation.reset}
        tryAgain={deleteTrack}
      />
    </SafeAreaView>
  );
};
TrackScreen.navTitle = m.title;

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}): NativeStackNavigationOptions {
  return {
    headerTitle: intl(m.title),
    headerShadowVisible: false,
    headerStyle: {backgroundColor: 'transparent'},
    headerTitleAlign: 'center',
    headerTransparent: true,
  };
}

export const styles = StyleSheet.create({
  positionText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: '700',
  },
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  divider: {borderBottomColor: '#CCCCD6', borderBottomWidth: 1},
  trackTitleWrapper: {
    marginVertical: 10,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackTitle: {fontSize: 20, fontWeight: '700', color: DARK_GREY},
  text: {
    margin: 10,
    fontSize: 22,
  },
});
