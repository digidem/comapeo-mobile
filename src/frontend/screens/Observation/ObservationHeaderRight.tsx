import * as React from 'react';
import {View} from 'react-native';
import {IconButton, headerItemStyle} from '../../sharedComponents/IconButton';
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
    <View style={headerItemStyle}>
      <SyncIcon color="#3C69F6" />
    </View>
  );
};
