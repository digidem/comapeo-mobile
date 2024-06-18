import * as React from 'react';
import {BottomSheetContent} from './BottomSheet';
import ErrorIcon from '../images/Error.svg';
import DiscardIcon from '../images/delete.svg';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  cancel: {
    id: 'sharedComponents.ConfirmDiscard.cancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
});

type ConfirmDiscardBottomSheetContentProps = {
  header: string;
  subHeader: string;
  handleDiscard: () => void;
  discardButtonText: string;
  closeSheet: () => void;
};

export const ConfirmDiscardBottomSheetContent = ({
  header,
  subHeader,
  handleDiscard,
  discardButtonText,
  closeSheet,
}: ConfirmDiscardBottomSheetContentProps) => {
  const {formatMessage} = useIntl();
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
          text: formatMessage(m.cancel),
          variation: 'outlined',
        },
      ]}
      icon={<ErrorIcon width={60} height={60} style={{marginBottom: 15}} />}
    />
  );
};
