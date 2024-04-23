import React, {FC} from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import Close from '../../../../images/close.svg';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useCreateTrack} from '../../../../hooks/server/track';
import {useCurrentTrackStore} from '../../../../hooks/tracks/useCurrentTrackStore';
import {DateTime} from 'luxon';
import {TabName} from '../../../../Navigation/types';
import {useNavigationFromHomeTabs} from '../../../../hooks/useNavigationWithTypes';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  trackEditScreenTitle: {
    id: 'screens.SaveTrack.TrackEditView.title',
    defaultMessage: 'New Track',
    description: 'Title for new track screen',
  },
});

export interface SaveTrackHeader {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
}

export const SaveTrackHeader: FC<SaveTrackHeader> = ({bottomSheetRef}) => {
  const saveTrack = useCreateTrack();
  const currentTrack = useCurrentTrackStore();
  const navigation = useNavigationFromHomeTabs();

  const {formatMessage: t} = useIntl();

  const handleSaveClick = () => {
    saveTrack.mutate(
      {
        schemaName: 'track',
        attachments: [],
        refs: currentTrack.observations.map(observationId => ({
          id: observationId,
          type: 'observation',
        })),
        tags: {},
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
          navigation.navigate(TabName.Map);
          currentTrack.clearCurrentTrack();
        },
      },
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.closeWrapper}>
        <Pressable
          hitSlop={10}
          onPress={() => bottomSheetRef.current?.present()}>
          <Close style={styles.closeIcon} />
        </Pressable>
        <Text style={styles.text}>{t(m.trackEditScreenTitle)}</Text>
      </View>
      <Pressable disabled={saveTrack.isPending} onPress={handleSaveClick}>
        <Image
          style={styles.completeIcon}
          source={require('../../../../images/completed/checkComplete.png')}
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
