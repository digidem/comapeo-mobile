import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {IconButton} from '../../sharedComponents/IconButton';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';
import {useDraftObservation} from '../../hooks/useDraftObservation';

import {EditIcon} from '../../sharedComponents/icons';
import {SyncIcon} from '../../sharedComponents/icons/SyncIconCircle';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {UIActivityIndicator} from 'react-native-indicators';
import {useCreatedByToDeviceId} from '../../hooks/server/projects.ts';

export const ObservationHeaderRight = ({
  observationId,
}: {
  observationId: string;
}) => {
  const observationWithPreset = useObservationWithPreset(observationId);
  const {data: createdByDeviceId, isPending: isCreatedByDeviceIdPending} =
    useCreatedByToDeviceId(observationWithPreset.observation.createdBy);

  const {data: deviceInfo, isPending: isDeviceInfoPending} = useDeviceInfo();
  const {editSavedObservation} = useDraftObservation();
  const navigation = useNavigationFromRoot();

  function handlePress() {
    editSavedObservation(observationWithPreset);
    navigation.navigate('ObservationEdit', {observationId});
  }

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
    <IconButton onPress={handlePress} testID="editButton">
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
