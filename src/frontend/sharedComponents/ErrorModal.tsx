import * as React from 'react';
import {BottomSheetModal, useBottomSheetModal} from './BottomSheetModal';
import {Button} from './Button';
import {View} from 'react-native';

type ErrorModalProps = Omit<
  ReturnType<typeof useBottomSheetModal>,
  'openSheet'
> & {clearError: () => void; retryFn?: () => void};

export const ErrorModal = ({
  clearError,
  closeSheet,
  sheetRef,
  retryFn,
  isOpen,
}: ErrorModalProps) => {
  function handleGoBack() {
    clearError();
    closeSheet();
  }

  function handleTryAgain() {
    clearError();
    if (!retryFn) throw new Error('cannot retryFn if no function was provided');
    retryFn();
    closeSheet();
  }

  return (
    <BottomSheetModal ref={sheetRef} fullHeight isOpen={isOpen}>
      <View>
        <Button onPress={handleGoBack}> Go Back</Button>
        {retryFn && <Button onPress={handleTryAgain}>Try Again</Button>}
      </View>
    </BottomSheetModal>
  );
};
