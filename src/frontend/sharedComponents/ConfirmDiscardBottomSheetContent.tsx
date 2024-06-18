import * as React from 'react';
import {BottomSheetContent} from './BottomSheet';
import ErrorIcon from '../images/Error.svg';
import DiscardIcon from '../images/delete.svg';

type ConfirmDiscardBottomSheetContentProps = {
  header: string;
  subHeader: string;
  handleDiscard: () => void;
  discardButtonText: string;
  discardButtonCancel: string;
  closeSheet: () => void;
};

export const ConfirmDiscardBottomSheetContent = ({
  header,
  subHeader,
  handleDiscard,
  discardButtonText,
  closeSheet,
  discardButtonCancel,
}: ConfirmDiscardBottomSheetContentProps) => {
  return (
    <BottomSheetContent
      title={header}
      description={subHeader}
      buttonConfigs={[
        {
          variation: 'filled',
          dangerous: true,
          onPress: handleDiscard,
          text: discardButtonText,
          icon: <DiscardIcon />,
        },
        {
          onPress: closeSheet,
          text: discardButtonCancel,
          variation: 'outlined',
        },
      ]}
      icon={<ErrorIcon width={80} height={80} style={{marginBottom: 15}} />}
    />
  );
};
