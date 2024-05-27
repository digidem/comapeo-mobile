import React, {FC} from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';
import {Text} from '../../sharedComponents/Text.tsx';
import Close from '../../images/close.svg';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useCreateTrack, useUpdateTrack} from '../../hooks/server/track.ts';
import {DateTime} from 'luxon';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes.ts';
import {defineMessages, useIntl} from 'react-intl';
import {Track} from '@mapeo/schema';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack.ts';

const m = defineMessages({
  trackCreateScreenTitle: {
    id: 'screens.SaveTrack.CreateTrackTitle',
    defaultMessage: 'New Track',
    description: 'Title for new track screen',
  },
  trackEditScreenTitle: {
    id: 'screens.SaveTrack.trackEditTitle',
    defaultMessage: 'Edit track',
    description: 'Edit track',
  },
});

export interface TrackEditScreenHeader {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  description: string;
  isEdit: boolean;
  track?: Track;
}

export const TrackEditScreenHeader: FC<TrackEditScreenHeader> = ({
  bottomSheetRef,
  isEdit,
  track,
  description,
}) => {
  const {formatMessage: t} = useIntl();
  const saveTrack = useCreateTrack();
  const updateTrack = useUpdateTrack(track?.versionId);
  const currentTrack = usePersistedTrack();
  const navigation = useNavigationFromHomeTabs();

  const saveTrackClick = () => {
    saveTrack.mutate(
      {
        schemaName: 'track',
        attachments: [],
        refs: currentTrack.observations.map(observationId => ({
          id: observationId,
          type: 'observation',
        })),
        tags: {
          notes: description,
        },
        locations: currentTrack.locationHistory.map(loc => {
          return {
            coords: {
              latitude: loc.latitude,
              longitude: loc.longitude,
            },
            mocked: false,
            timestamp: DateTime.fromMillis(loc.timestamp).toISO()!,
          };
        }),
      },
      {
        onSuccess: () => {
          navigation.navigate('Home', {screen: 'Map'});
          currentTrack.clearCurrentTrack();
        },
      },
    );
  };

  const updateCurrentTrack = () => {
    updateTrack.mutate(
      {
        ...track!,
        tags: {
          notes: description,
        },
      },
      {
        onSuccess: () => {
          navigation.pop();
        },
      },
    );
  };

  const handleClick = () => {
    isEdit ? updateCurrentTrack() : saveTrackClick();
  };

  return (
    <View style={styles.container}>
      <View style={styles.closeWrapper}>
        <Pressable
          hitSlop={10}
          onPress={() => bottomSheetRef.current?.present()}>
          <Close style={styles.closeIcon} />
        </Pressable>
        <Text style={styles.text}>
          {t(isEdit ? m.trackEditScreenTitle : m.trackCreateScreenTitle)}
        </Text>
      </View>
      <Pressable disabled={saveTrack.isPending} onPress={handleClick}>
        <Image
          style={styles.completeIcon}
          source={require('../../images/completed/checkComplete.png')}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeWrapper: {flexDirection: 'row', alignItems: 'center'},
  closeIcon: {width: 15, height: 15, marginRight: 20},
  text: {fontSize: 16, fontWeight: 'bold'},
  completeIcon: {width: 30, height: 30},
});
