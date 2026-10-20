import * as React from 'react';
import {EditIcon} from '../../sharedComponents/icons';
import {SyncIcon} from '../../sharedComponents/icons';
import {
  HeaderRightContainer,
  HeaderRightContainerButton,
} from '../../sharedComponents/HeaderRightContainer';

type ObservationHeaderRightProps =
  | {canEdit: false}
  | {canEdit: true; setObservationToStoreAndNavigateToEdit: () => void};

export const ObservationHeaderRight = (props: ObservationHeaderRightProps) => {
  return props.canEdit ? (
    <HeaderRightContainerButton
      loading={false}
      onPress={props.setObservationToStoreAndNavigateToEdit}
      testID="editButton">
      <EditIcon />
    </HeaderRightContainerButton>
  ) : (
    <HeaderRightContainer>
      <SyncIcon color="#3C69F6" />
    </HeaderRightContainer>
  );
};
