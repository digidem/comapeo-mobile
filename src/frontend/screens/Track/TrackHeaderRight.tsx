import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {IconButton} from '../../sharedComponents/IconButton';
import {useSingleDocByDocId} from '@comapeo/core-react';
import {EditIcon} from '../../sharedComponents/icons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useActiveProject} from '../../contexts/ActiveProjectContext.tsx';
import {useCanEditOrDelete} from '../../hooks/server/useCanEditOrDelete.ts';

export const TrackHeaderRight = ({trackId}: {trackId: string}) => {
  const {projectId} = useActiveProject();
  const {data: track} = useSingleDocByDocId({
    projectId,
    docType: 'track',
    docId: trackId,
  });

  const navigation = useNavigationFromRoot();

  const canEdit = useCanEditOrDelete(track.createdBy);

  return canEdit ? (
    <IconButton
      onPress={() => navigation.navigate('TrackEdit', {trackId})}
      testID="editButton">
      <EditIcon />
    </IconButton>
  ) : (
    <View style={styles.syncIconContainer} />
  );
};

const styles = StyleSheet.create({
  syncIconContainer: {
    width: 60,
    height: 60,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
