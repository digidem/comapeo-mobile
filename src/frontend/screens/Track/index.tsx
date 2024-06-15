import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import {BLACK, WHITE, DARK_GREY} from '../../lib/styles.ts';

import TrackIcon from '../../images/Track.svg';
import EditIcon from '../../images/Edit.svg';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft.tsx';
import {defineMessages} from 'react-intl';
import {useDeleteTrackMutation, useTrack} from '../../hooks/server/track.ts';
import {useObservations} from '../../hooks/server/observations.ts';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {MapPreview} from './MapPreview.tsx';
import {ObservationList} from './ObservationList.tsx';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet.tsx';
import {ActionButtons} from '../../sharedComponents/ActionButtons.tsx';

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
});

export const TrackScreen: NativeNavigationComponent<'Track'> = ({
  route,
  navigation,
}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: (props: any) => (
        <CustomHeaderLeft headerBackButtonProps={props} tintColor={BLACK} />
      ),
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Pressable onPress={() => {}}>
          <EditIcon />
        </Pressable>
      ),
    });
  }, [navigation]);

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
      <View>
        <MapPreview
          locationHistory={track.locations.map(({timestamp, coords}) => ({
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: parseInt(timestamp, 10),
          }))}
        />
        <View style={styles.trackTitleWrapper}>
          <TrackIcon style={{marginRight: 10}} />
          <Text style={styles.trackTitle}>Tracks</Text>
        </View>
        <View style={styles.divider} />
        <ScrollView>
          <ObservationList observations={trackObservations} />
          <View style={styles.divider} />
        </ScrollView>
        <Text style={styles.text}>{track.tags.notes as string}</Text>
      </View>
      <ActionButtons
        handleDelete={deleteTrack}
        isMine={true}
        deleteMessage={m.deleteTitle}
      />
      <ErrorBottomSheet
        error={deleteTrackMutation.error}
        clearError={deleteTrackMutation.reset}
        tryAgain={deleteTrack}
      />
    </SafeAreaView>
  );
};
TrackScreen.navTitle = m.title;

export const styles = StyleSheet.create({
  positionText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: '700',
  },
  root: {
    backgroundColor: WHITE,
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
  },
  trackTitle: {fontSize: 20, fontWeight: '700', color: DARK_GREY},
  text: {
    margin: 10,
    fontSize: 22,
  },
});
