import * as React from 'react';
import * as Sentry from '@sentry/react-native';
import {defineMessages, useIntl} from 'react-intl';

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
};

export const ErrorBottomSheet = (props: ErrorModalProps) => {
  const {error, clearError, tryAgain} = props;

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
        icon={<ErrorIcon style={{marginTop: 80}} />}
        title={formatMessage(m.somethingWrong)}
        buttonConfigs={buttonConfigs}
      />
    </BottomSheetModal>
  );
};
