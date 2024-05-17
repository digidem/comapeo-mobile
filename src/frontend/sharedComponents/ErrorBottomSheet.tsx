import * as React from 'react';
import {BottomSheetModal, useBottomSheetModal} from './BottomSheetModal';
import {Button} from './Button';
import {StyleSheet, View} from 'react-native';
import {LogoWithErrorIcon} from './LogoWithErrorIcon';
import {Text} from './Text';
import {defineMessages, useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';

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

  function handleTryAgain() {
    clearError();
    closeSheet();
    tryAgain!();
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      fullHeight
      onDismiss={closeSheet}
      isOpen={isOpen}>
      <>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <LogoWithErrorIcon />
            <Text style={styles.headerText}>
              {formatMessage(m.somethingWrong)}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'flex-end',
              flex: 1,
              gap: 15,
            }}>
            <Button
              fullWidth
              onPress={handleGoBack}
              variant="outlined"
              color="ComapeoBlue">
              {formatMessage(m.goBack)}
            </Button>
            {tryAgain && (
              <Button fullWidth onPress={handleTryAgain}>
                {formatMessage(m.tryAgain)}
              </Button>
            )}
          </View>
        </View>
      </>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 20,
    paddingTop: 80,
  },
  wrapper: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
});
