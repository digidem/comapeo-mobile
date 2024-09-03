import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {IconButton} from '../../sharedComponents/IconButton';
import {useTrackQuery} from '../../hooks/server/track';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {UIActivityIndicator} from 'react-native-indicators';
import {EditIcon} from '../../sharedComponents/icons';
import {useOriginalVersionIdToDeviceId} from '../../hooks/server/projects.ts';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

export const TrackHeaderRight = ({trackId}: {trackId: string}) => {
  const {data: track, isLoading: isTrackLoading} = useTrackQuery(trackId);
  const {data: convertedDeviceId, isPending: isDeviceIdPending} =
    useOriginalVersionIdToDeviceId(track?.originalVersionId);

  const {data: deviceInfo, isPending: isDeviceInfoPending} = useDeviceInfo();
  const navigation = useNavigationFromRoot();

  if (isDeviceInfoPending || isDeviceIdPending || isTrackLoading) {
    return (
      <UIActivityIndicator
        size={20}
        style={{alignItems: 'flex-end', marginRight: 20}}
      />
    );
  }

  const canEdit = convertedDeviceId === deviceInfo?.deviceId;

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
