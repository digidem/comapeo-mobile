import React, {FC, RefObject} from 'react';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetContent, BottomSheetModal} from '../BottomSheetModal';
import DiscardIcon from '../images/delete.svg';
import ErrorIcon from '../images/Error.svg';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  defaultButton: {
    id: 'sharedComponents.DiscardModal.defaultButton',
    defaultMessage: 'Continue Editing',
  },
});

export interface DiscardModal {
  closeSheet: () => void;
  title: MessageDescriptor;
  description: MessageDescriptor;
  handleDiscard: () => void;
  discardButtonText: MessageDescriptor;
}

export const DiscardModal: FC<DiscardModal> = props => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetContent
      title={formatMessage(props.title)}
      description={formatMessage(props.description)}
      buttonConfigs={[
        {
          variation: 'filled',
          dangerous: true,
          onPress: props.handleDiscard,
          text: formatMessage(props.discardButtonText),
          icon: <DiscardIcon />,
        },
        {
          onPress: closeSheet,
          text: formatMessage(m.defaultButton),
          variation: 'outlined',
        },
      ]}
      icon={<ErrorIcon width={60} height={60} style={{marginBottom: 15}} />}
    />
  );
};
