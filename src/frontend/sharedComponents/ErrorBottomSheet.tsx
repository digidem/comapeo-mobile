import * as React from 'react';
import * as Sentry from '@sentry/react-native';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

import {ActionButtonConfig} from './BottomSheetModal/Content';
import {
  BottomSheetModalContent,
  BottomSheetModal,
  useBottomSheetModal,
} from './BottomSheetModal';
import ErrorIcon from '../images/Error.svg';

const m = defineMessages({
  somethingWrong: {
    id: 'sharedComponents.ErrorModal.somethingWrong',
    defaultMessage: 'Something\n Went Wrong',
  },
  goBack: {
    id: 'sharedComponents.ErrorModal.goBack',
    defaultMessage: 'Go Back',
  },
  tryAgain: {
    id: 'sharedComponents.ErrorModal.tryAgain',
    defaultMessage: 'Try Again',
  },
});

type ErrorModalProps = {
  error: Error | null;
  clearError: () => void;
  tryAgain?: () => unknown;
  title?: MessageDescriptor;
  description?: MessageDescriptor;
};

export const ErrorBottomSheet = (props: ErrorModalProps) => {
  const {error, clearError, tryAgain, title, description} = props;

  const {formatMessage} = useIntl();
  const {openSheet, sheetRef, isOpen, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  if (error && !isOpen) {
    Sentry.captureMessage(error.message, 'error');
    openSheet();
  }

  const buttonConfigs: Array<ActionButtonConfig> = [
    {
      variation: 'outlined',
      onPress: () => {
        clearError();
        closeSheet();
      },
      text: formatMessage(m.goBack),
    },
  ];

  if (tryAgain) {
    buttonConfigs.push({
      variation: 'filled',
      onPress: () => {
        clearError();
        closeSheet();
        tryAgain();
      },
      text: formatMessage(m.tryAgain),
    });
  }

  return (
    <BottomSheetModal
      fullScreen
      ref={sheetRef}
      onDismiss={closeSheet}
      isOpen={isOpen}>
      <BottomSheetModalContent
        icon={<ErrorIcon width={160} height={160} style={{marginTop: 80}} />}
        title={formatMessage(title || m.somethingWrong)}
        description={description ? formatMessage(description) : undefined}
        buttonConfigs={buttonConfigs}
        descriptionStyle={{fontSize: 16}}
      />
    </BottomSheetModal>
  );
};
