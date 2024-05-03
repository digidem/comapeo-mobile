import {Image, Pressable, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {DateTime} from 'luxon';
import {useCreateTrack} from '../../../../hooks/server/track';
import {useCurrentTrackStore} from '../../../../hooks/tracks/useCurrentTrackStore';
import {useNavigationFromHomeTabs} from '../../../../hooks/useNavigationWithTypes';

interface SaveTrackButton {
  description: string;
}

export const SaveTrackButton: FC<SaveTrackButton> = ({description}) => {
  const saveTrack = useCreateTrack();
  const navigation = useNavigationFromHomeTabs();
  const currentTrack = useCurrentTrackStore();

  const handleSaveClick = () => {
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
          navigation.navigate('Map');
          currentTrack.clearCurrentTrack();
        },
      },
    );
  };

  return (
    <Pressable disabled={saveTrack.isPending} onPress={handleSaveClick}>
      <Image
        style={styles.completeIcon}
        source={require('../../../../images/completed/checkComplete.png')}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  completeIcon: {width: 30, height: 30},
});
