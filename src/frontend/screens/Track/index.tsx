import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import {BLACK, WHITE, DARK_GREY} from '../../lib/styles.ts';
import DeleteIcon from '../../images/DeleteTrack.svg';
import TrackIcon from '../../images/Track.svg';
import EditIcon from '../../images/Edit.svg';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft.tsx';
import {defineMessages, useIntl} from 'react-intl';
import {useDeleteTrackMutation, useTrack} from '../../hooks/server/track.ts';
import {useObservations} from '../../hooks/server/observations.ts';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {MapPreview} from './MapPreview.tsx';
import {ObservationList} from './ObservationList.tsx';
import {ActionButtons} from './ActionButtons.tsx';

const m = defineMessages({
  title: {
    id: 'screens.Track.title',
    defaultMessage: 'Track',
    description:
      'Title of track screen showing (non-editable) view of observation with map',
  },
  trackHeader: {
    id: 'screens.Track.trackHeader',
    defaultMessage: 'Track',
  },
  cancel: {
    id: 'screens.Track.cancel',
    defaultMessage: 'Cancel',
    description: 'Button to cancel delete of track',
  },
  confirm: {
    id: 'screens.Track.confirm',
    defaultMessage: 'Yes, delete',
    description: 'Button to confirm delete of track',
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
  const {formatMessage: t} = useIntl();

  const actions = [
    {
      icon: DeleteIcon,
      text: 'Delete',
      onPress: () => {
        Alert.alert(t(m.deleteTitle), undefined, [
          {
            text: t(m.cancel),
            onPress: () => {},
          },
          {
            text: t(m.confirm),
            onPress: () => {
              deleteTrackMutation.mutate(track.docId, {
                onSuccess: () => {
                  navigation.navigate('Home', {screen: 'Map'});
                },
              });
              navigation.pop();
            },
          },
        ]);
      },
    },
  ];

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
          {/* <TrackEditDescriptionField description={track.tags.notes as string} /> */}
        </ScrollView>
      </View>
      <ActionButtons actions={actions} />
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
});
