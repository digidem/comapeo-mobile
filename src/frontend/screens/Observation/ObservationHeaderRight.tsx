import * as React from 'react';
import {EditIcon} from '../../sharedComponents/icons';
import {SyncIcon} from '../../sharedComponents/icons';
import {
  HeaderRightIconContainer,
  HeaderRightIconContainerButton,
} from '../../sharedComponents/HeaderRightContainer';

type ObservationHeaderRightProps =
  | {canEdit: false}
  | {canEdit: true; setObservationToStoreAndNavigateToEdit: () => void};

export const ObservationHeaderRight = (props: ObservationHeaderRightProps) => {
  return props.canEdit ? (
    <HeaderRightIconContainerButton
      loading={false}
      onPress={props.setObservationToStoreAndNavigateToEdit}
      testID="editButton">
      <EditIcon />
    </HeaderRightIconContainerButton>
  ) : (
    <HeaderRightIconContainer>
      <SyncIcon color="#3C69F6" />
    </HeaderRightIconContainer>
  );
};
