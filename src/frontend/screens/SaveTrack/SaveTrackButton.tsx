import React, {FC} from 'react';

import {useTrackActions, useTrackState} from '../../contexts/TrackStoreContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useCreateDocument} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import type {Position} from '@comapeo/schema/dist/schema/track';
import {HeaderRightIconContainerButton} from '../../sharedComponents/HeaderRightContainer';
import SaveCheck from '../../images/CheckMark.svg';

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
    <HeaderRightIconContainerButton
      loading={status === 'pending'}
      onPress={handleSaveClick}>
      <SaveCheck />
    </HeaderRightIconContainerButton>
  );
};
