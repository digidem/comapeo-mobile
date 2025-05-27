import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton} from '../../sharedComponents/IconButton';
import {EditIcon} from '../../sharedComponents/icons';
import {SyncIcon} from '../../sharedComponents/icons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {
  useOwnDeviceInfo,
  useSingleDocByDocId,
  useDocumentCreatedBy,
  useOwnRoleInProject,
} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext.tsx';
import {COORDINATOR_ROLE_ID} from '../../sharedTypes';

interface ObservationHeaderRightProps {
  observationId: string;
}

export const ObservationHeaderRight = ({
  observationId,
}: ObservationHeaderRightProps) => {
  const {projectId} = useActiveProject();
  const {data: observation} = useSingleDocByDocId({
    projectId: projectId,
    docType: 'observation',
    docId: observationId,
  });

  const {data: createdByDeviceId} = useDocumentCreatedBy({
    projectId: projectId,
    originalVersionId: observation.originalVersionId,
  });

  const {data: deviceInfo} = useOwnDeviceInfo();
  const {data: roleData} = useOwnRoleInProject({projectId});
  const navigation = useNavigationFromRoot();

  const canEdit =
    createdByDeviceId === deviceInfo?.deviceId ||
    roleData.roleId === COORDINATOR_ROLE_ID;

  return canEdit ? (
    <IconButton
      onPress={() => navigation.navigate('ObservationEdit', {observationId})}
      testID="editButton">
      <EditIcon />
    </IconButton>
  ) : (
    <View style={styles.syncIconContainer}>
      <SyncIcon color="#3C69F6" />
    </View>
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
