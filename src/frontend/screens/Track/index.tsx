import React from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {BLACK, DARK_GREY} from '../../lib/styles.ts';

import TrackIcon from '../../images/Track.svg';
import {FormattedMessage, MessageDescriptor, defineMessages} from 'react-intl';
import {
  useDeleteTrackMutation,
  useTrackQuery,
} from '../../hooks/server/track.ts';
import {useObservations} from '../../hooks/server/observations.ts';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {MapPreview} from './MapPreview.tsx';
import {ObservationList} from './ObservationList.tsx';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet.tsx';
import {ActionButtons} from '../../sharedComponents/ActionButtons.tsx';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock.tsx';
import {TrackHeaderRight} from './TrackHeaderRight';

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

export const TrackScreen = ({
  route,
  navigation,
}: NativeRootNavigationProps<'Track'>) => {
  const {trackId} = route.params;

  const {data: track} = useTrackQuery(trackId);
  const {data: observations} = useObservations();
  const trackObservations = observations.filter(observation =>
    track.observationRefs.some(ref => ref.docId === observation.docId),
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
            observations={trackObservations}
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
export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (props: NativeRootNavigationProps<'Track'>) => {
    return {
      headerTitle: intl(m.title),
      headerRight: () => (
        <TrackHeaderRight trackId={props.route.params.trackId} />
      ),
    };
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
