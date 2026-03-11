import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  useOwnDeviceInfo,
  useOwnRoleInProject,
  useSingleDocByDocId,
} from '@comapeo/core-react';

import {IconButton} from '../../sharedComponents/IconButton';
import {EditIcon} from '../../sharedComponents/icons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useActiveProject} from '../../contexts/ActiveProjectContext.tsx';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../../sharedTypes/index.ts';

export const TrackHeaderRight = ({trackId}: {trackId: string}) => {
  const {projectId} = useActiveProject();
  const {data: track} = useSingleDocByDocId({
    projectId,
    docType: 'track',
    docId: trackId,
  });

  const navigation = useNavigationFromRoot();

  const {data: role} = useOwnRoleInProject({projectId});
  const {data: ownDeviceInfo} = useOwnDeviceInfo();

  const canEdit =
    track.createdBy === ownDeviceInfo.deviceId ||
    role.roleId === CREATOR_ROLE_ID ||
    role.roleId === COORDINATOR_ROLE_ID;

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
