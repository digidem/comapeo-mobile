import {CommonActions} from '@react-navigation/native';
import {DateTime} from 'luxon';
import React, {FC} from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';

import {useTrackActions, useTrackState} from '../../contexts/TrackStoreContext';
import {useCreateTrack} from '../../hooks/server/track';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

export const SaveTrackButton: FC = () => {
  const saveTrack = useCreateTrack();
  const navigation = useNavigationFromRoot();
  const observationRefs = useTrackState(state => state.observationRefs);
  const locationHistory = useTrackState(state => state.locationHistory);
  const description = useTrackState(state => state.description);
  const {clearCurrentTrack} = useTrackActions();

  const handleSaveClick = () => {
    saveTrack.mutate(
      {
        schemaName: 'track',
        observationRefs,
        tags: {
          notes: description,
        },
        locations: locationHistory.map(loc => {
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
          clearCurrentTrack();
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
