import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {IconButton} from '../../sharedComponents/IconButton';
import {
  useOwnDeviceInfo,
  useSingleDocByDocId,
  useDocumentCreatedBy,
} from '@comapeo/core-react';
import {EditIcon} from '../../sharedComponents/icons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useActiveProject} from '../../contexts/ActiveProjectContext.tsx';

export const TrackHeaderRight = ({trackId}: {trackId: string}) => {
  const {projectId} = useActiveProject();
  const {data: track} = useSingleDocByDocId({
    projectId,
    docType: 'track',
    docId: trackId,
  });

  const {data: createdByDeviceId} = useDocumentCreatedBy({
    projectId,
    originalVersionId: track.originalVersionId,
  });

  const {data: deviceInfo} = useOwnDeviceInfo();
  const navigation = useNavigationFromRoot();

  const canEdit = createdByDeviceId === deviceInfo?.deviceId;

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
