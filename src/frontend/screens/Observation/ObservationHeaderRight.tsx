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
} from '@comapeo/core-react';
import {Loading} from '../../sharedComponents/Loading.tsx';
import {useActiveProject} from '../../contexts/ActiveProjectContext.tsx';

interface ObservationHeaderRightProps {
  observationId: string;
}

const ObservationHeaderRightContent = ({
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
  const navigation = useNavigationFromRoot();

  const canEdit = createdByDeviceId === deviceInfo?.deviceId;

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

export const ObservationHeaderRight = ({
  observationId,
}: ObservationHeaderRightProps) => (
  <React.Suspense fallback={<Loading />}>
    <ObservationHeaderRightContent observationId={observationId} />
  </React.Suspense>
);

const styles = StyleSheet.create({
  syncIconContainer: {
    width: 60,
    height: 60,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
