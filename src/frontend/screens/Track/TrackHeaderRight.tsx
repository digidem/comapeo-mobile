import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {IconButton} from '../../sharedComponents/IconButton';
import {useTrackQuery} from '../../hooks/server/track';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {UIActivityIndicator} from 'react-native-indicators';
import EditIcon from '../../images/Edit.svg';
import {useCreatedByToDeviceId} from '../../hooks/server/projects.ts';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

export const TrackHeaderRight = ({trackId}: {trackId: string}) => {
  const {data: track, isLoading: isTrackLoading} = useTrackQuery(trackId);
  const {data: createdByDeviceId, isPending: isCreatedByDeviceIdPending} =
    useCreatedByToDeviceId(track?.createdBy);

  const {data: deviceInfo, isPending: isDeviceInfoPending} = useDeviceInfo();
  const navigation = useNavigationFromRoot();

  if (isDeviceInfoPending || isCreatedByDeviceIdPending || isTrackLoading) {
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
