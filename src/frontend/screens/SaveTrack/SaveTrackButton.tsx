import {Image, Pressable, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {DateTime} from 'luxon';
import {useCreateTrack} from '../../hooks/server/track';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {CommonActions} from '@react-navigation/native';

export const SaveTrackButton: FC = () => {
  const saveTrack = useCreateTrack();
  const navigation = useNavigationFromRoot();
  const currentTrack = usePersistedTrack();
  const description = usePersistedTrack(state => state.description);

  const handleSaveClick = () => {
    saveTrack.mutate(
      {
        schemaName: 'track',
        observationRefs: currentTrack.observationRefs,
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
          currentTrack.clearCurrentTrack();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Home', params: {screen: 'Map'}}],
            }),
          );
        },
      },
    );
  };

  return (
    <Pressable disabled={saveTrack.isPending} onPress={handleSaveClick}>
      <Image
        style={styles.completeIcon}
        source={require('../../images/completed/checkComplete.png')}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  completeIcon: {width: 30, height: 30},
});
