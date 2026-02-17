import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton} from '../../sharedComponents/IconButton';
import {EditIcon} from '../../sharedComponents/icons';
import {SyncIcon} from '../../sharedComponents/icons';

type ObservationHeaderRightProps =
  | {canEdit: false}
  | {canEdit: true; setObservationToStoreAndNavigateToEdit: () => void};

export const ObservationHeaderRight = (props: ObservationHeaderRightProps) => {
  return props.canEdit ? (
    <IconButton
      onPress={props.setObservationToStoreAndNavigateToEdit}
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
