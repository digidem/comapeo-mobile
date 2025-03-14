import {Image, Pressable, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {DateTime} from 'luxon';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {CommonActions} from '@react-navigation/native';
import {useCreateDocument} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const SaveTrackButton: FC = () => {
  const navigation = useNavigationFromRoot();
  const currentTrack = usePersistedTrack();
  const description = usePersistedTrack(state => state.description);
  const {projectId} = useActiveProject();
  const {mutate: createTrack, status} = useCreateDocument({
    docType: 'track',
    projectId,
  });

  const handleSaveClick = () => {
    createTrack(
      {
        value: {
          observationRefs: currentTrack.observationRefs,
          tags: {
            notes: description,
          },
          locations: currentTrack.locationHistory.map(loc => ({
            coords: {
              latitude: loc.latitude,
              longitude: loc.longitude,
            },
            mocked: false,
            timestamp: DateTime.fromMillis(loc.timestamp).toISO()!,
          })),
        },
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
    <Pressable disabled={status === 'pending'} onPress={handleSaveClick}>
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
