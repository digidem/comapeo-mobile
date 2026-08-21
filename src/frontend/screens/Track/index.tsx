import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  BLUE_GREY,
  DARK_GREY,
  LIGHT_GREY,
  VERY_LIGHT_GREY,
} from '../../lib/styles.ts';

import TrackIcon from '../../images/Track.svg';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
  useIntl,
} from 'react-intl';
import {useTrackQuery, useGetPresetById} from '../../hooks/server/track.ts';
import {useObservations} from '../../hooks/server/observations.ts';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {MapPreview} from './MapPreview.tsx';
import {ObservationList} from './ObservationList.tsx';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock.tsx';
import {TrackHeaderRight} from './TrackHeaderRight';
import {useCanEditOrDelete} from '../../hooks/server/useCanEditOrDelete.ts';
import {
  getLocationHistoryFromTrack,
  getTrackDurationAndDistance,
} from '../../utils/trackMetrics';
import {TrackStats} from '../../sharedComponents/TrackStats.tsx';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';

const m = defineMessages({
  title: {
    id: '$1screens.Track.title',
    defaultMessage: 'Track',
    description:
      'Title of track screen showing (non-editable) view of observation with map',
  },
  tracks: {
    id: 'screens.Track.tracks',
    defaultMessage: 'Tracks',
  },
  delete: {
    id: 'SharedComponents.ActionButtons.delete',
    defaultMessage: 'Delete',
    description: 'Button to delete a track',
  },
});

export const TrackScreen = ({
  route,
  navigation,
}: NativeRootNavigationProps<'Track'>) => {
  const {trackId} = route.params;
  const {formatMessage: t} = useIntl();

  const {data: track} = useTrackQuery(trackId);
  const {data: observations} = useObservations();
  const trackObservations = observations.filter(observation =>
    track.observationRefs.some(ref => ref.docId === observation.docId),
  );
  const canDelete = useCanEditOrDelete(track.createdBy);
  const locationHistory = getLocationHistoryFromTrack(track);
  const {durationMs, distance} = getTrackDurationAndDistance(locationHistory);
  const preset = useGetPresetById(track?.presetRef?.docId);

  function handlePressDelete() {
    navigation.navigate('ConfirmDeleteTrackBottomSheet', {trackId});
  }

  return (
    <ScreenContentWithDock
      contentContainerStyle={{padding: 0}}
      dockContainerStyle={{padding: 0}}
      dockContent={
        <View style={styles.buttonContainer}>
          {canDelete && (
            <TouchableOpacity onPress={handlePressDelete} style={{flex: 1}}>
              <View style={styles.button}>
                <MaterialIcons size={30} name="delete" color={DARK_GREY} />
                <BodyText variant="smallMeta" style={styles.buttonText}>
                  {t(m.delete)}
                </BodyText>
              </View>
            </TouchableOpacity>
          )}
        </View>
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
            {preset ? preset.name : <FormattedMessage {...m.tracks} />}
          </Text>
        </View>
        <View style={styles.divider} />
        <ObservationList observations={trackObservations} />
        <View style={styles.divider} />
        <HeaderText variant="header3" style={styles.text}>
          {track.tags.notes}
        </HeaderText>
      </View>
    </ScreenContentWithDock>
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
  button: {
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 1,
  },
});
