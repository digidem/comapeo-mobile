import React, {FC} from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';

import {useTrackActions, useTrackState} from '../../contexts/TrackStoreContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useCreateDocument} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import type {Position} from '@comapeo/schema/dist/schema/track';

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
  const preset = useTrackState(state => state.preset);

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
          })) as [Position, Position, ...Position[]],
          ...(preset
            ? {
                presetRef: {
                  docId: preset.docId,
                  versionId: preset.versionId,
                },
              }
            : {}),
        },
      },
      {
        onSuccess: () => {
          clearCurrentTrack();
          navigation.popTo('Home', {
            screen: 'Map',
          });
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
