import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {IconButton} from '../../sharedComponents/IconButton';

import {EditIcon} from '../../sharedComponents/icons';
import {SyncIcon} from '../../sharedComponents/icons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {UIActivityIndicator} from 'react-native-indicators';
import {useOriginalVersionIdToDeviceId} from '../../hooks/server/projects.ts';
import {useObservation} from '../../hooks/server/observations.ts';

export const ObservationHeaderRight = ({
  observationId,
}: {
  observationId: string;
}) => {
  const {data: observation} = useObservation(observationId);
  const {data: createdByDeviceId, isPending: isCreatedByDeviceIdPending} =
    useOriginalVersionIdToDeviceId(observation.originalVersionId);

  const {data: deviceInfo, isPending: isDeviceInfoPending} = useDeviceInfo();
  const navigation = useNavigationFromRoot();

  if (isDeviceInfoPending || isCreatedByDeviceIdPending) {
    return (
      <UIActivityIndicator
        size={20}
        style={{alignItems: 'flex-end', marginRight: 20}}
      />
    );
  }

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

const styles = StyleSheet.create({
  syncIconContainer: {
    width: 60,
    height: 60,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
