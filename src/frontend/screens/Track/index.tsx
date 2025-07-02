import React from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {BLUE_GREY, DARK_GREY, VERY_LIGHT_GREY} from '../../lib/styles.ts';

import TrackIcon from '../../images/Track.svg';
import {FormattedMessage, MessageDescriptor, defineMessages} from 'react-intl';
import {
  useDeleteTrackMutation,
  useTrackQuery,
  useGetPresetById,
} from '../../hooks/server/track.ts';
import {useObservations} from '../../hooks/server/observations.ts';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {MapPreview} from './MapPreview.tsx';
import {ObservationList} from './ObservationList.tsx';
import {ActionButtons} from '../../sharedComponents/ActionButtons.tsx';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock.tsx';
import {TrackHeaderRight} from './TrackHeaderRight';
import * as Sentry from '@sentry/react-native';
import {useCanEditOrDelete} from '../../hooks/server/useCanEditOrDelete.ts';
import {
  getLocationHistoryFromTrack,
  getTrackDurationAndDistance,
} from '../../utils/trackMetrics';
import {TrackStats} from '../../sharedComponents/Editor/TrackStats.tsx';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';

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
  const {mutate: deleteTrackMutate} = useDeleteTrackMutation();
  const canDelete = useCanEditOrDelete(track.originalVersionId);
  const locationHistory = getLocationHistoryFromTrack(track);
  const {durationMs, distance} = getTrackDurationAndDistance(locationHistory);
  const preset = useGetPresetById(track?.presetRef?.docId);

  function deleteTrack() {
    deleteTrackMutate(
      {docId: track.docId},
      {
        onSuccess: () => {
          navigation.pop();
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScreenContentWithDock
        contentContainerStyle={{padding: 0}}
        dockContainerStyle={{padding: 0}}
        dockContent={
          <ActionButtons
            handleDelete={deleteTrack}
            canDelete={canDelete}
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
          <TrackStats
            distance={distance}
            durationMs={durationMs}
            backgroundColor={VERY_LIGHT_GREY}
            center
          />
          <View style={styles.trackTitleWrapper}>
            {preset ? (
              <PresetCircleIcon iconId={preset.iconRef?.docId} size="medium" />
            ) : (
              <TrackIcon />
            )}
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
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  divider: {borderBottomColor: BLUE_GREY, borderBottomWidth: 1},
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
