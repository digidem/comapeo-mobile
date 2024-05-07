import {Image, Pressable, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {DateTime} from 'luxon';
import {useCreateTrack} from '../../../../hooks/server/track.ts';
import {usePersistedTrack} from '../../../../hooks/persistedState/usePersistedTrack.ts';
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes.ts';

interface SaveTrackButton {
  description: string;
}

export const SaveTrackButton: FC<SaveTrackButton> = ({description}) => {
  const saveTrack = useCreateTrack();
  const navigation = useNavigationFromRoot();
  const currentTrack = usePersistedTrack();

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
          navigation.navigate('Home', {screen: 'Map'});
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
