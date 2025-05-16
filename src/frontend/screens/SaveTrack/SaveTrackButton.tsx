import React, {FC} from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';

import {useTrackActions, useTrackState} from '../../contexts/TrackStoreContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useCreateDocument} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const SaveTrackButton: FC = () => {
  const navigation = useNavigationFromRoot();
  const {projectId} = useActiveProject();
  const {mutate: createTrack, status} = useCreateDocument({
    docType: 'track',
    projectId,
  });
  const observationRefs = useTrackState(state => state.observationRefs);
  const locationHistory = useTrackState(state => state.locationHistory);
  const description = useTrackState(state => state.description);
  const {clearCurrentTrack} = useTrackActions();

  const handleSaveClick = () => {
    createTrack(
      {
        value: {
          observationRefs: observationRefs,
          tags: {
            notes: description,
          },
          locations: locationHistory.map(loc => ({
            coords: {
              latitude: loc.latitude,
              longitude: loc.longitude,
            },
            mocked: false,
            timestamp: new Date(loc.timestamp).toISOString()!,
          })),
        },
      },
      {
        onSuccess: () => {
          clearCurrentTrack();
          navigation.goBack();
        },
      },
    );
  };

  return (
    <Pressable
      disabled={status === 'pending'}
      onPress={handleSaveClick}
      accessibilityLabel="Save track.">
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
