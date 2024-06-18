import * as React from 'react';
import * as Sentry from '@sentry/react-native';
import {defineMessages, useIntl} from 'react-intl';

import {ActionButtonConfig} from './BottomSheet/Content';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from './BottomSheetModal';
import {LogoWithErrorIcon} from './LogoWithErrorIcon';

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

  function handleGoBack() {
    clearError();
    closeSheet();
  }

  const buttonConfigs: Array<ActionButtonConfig> = tryAgain
    ? [
        {
          variation: 'outlined',
          onPress: handleGoBack,
          text: formatMessage(m.goBack),
        },
        {
          variation: 'filled',
          onPress: () => {
            clearError();
            closeSheet();
            tryAgain();
          },
          text: formatMessage(m.tryAgain),
        },
      ]
    : [
        {
          variation: 'filled',
          onPress: handleGoBack,
          text: formatMessage(m.goBack),
        },
      ];

  return (
    <BottomSheetModal ref={sheetRef} onDismiss={closeSheet} isOpen={isOpen}>
      <BottomSheetContent
        fullScreen
        icon={<LogoWithErrorIcon />}
        title={formatMessage(m.somethingWrong)}
        buttonConfigs={buttonConfigs}
      />
    </BottomSheetModal>
  );
};
