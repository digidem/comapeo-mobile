import * as React from 'react';
import {HeaderLeftClose} from '../../sharedComponents/HeaderLeftClose';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  BottomSheetModal,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import {ConfirmDiscardBottomSheetContent} from '../../sharedComponents/ConfirmDiscardBottomSheetContent';
import {defineMessages, useIntl} from 'react-intl';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';

const m = defineMessages({
  discardTitle: {
    id: 'AppContainer.EditHeader.discardTitle',
    defaultMessage: 'Discard observation?',
    description: 'Title of dialog that shows when cancelling a new observation',
  },
  discardObservationDescription: {
    id: 'AppContainer.EditHeader.discardObservationDescription',
    defaultMessage:
      'Your Observation will not be saved. This cannot be undone. ',
  },
  discardCancel: {
    id: 'AppContainer.EditHeader.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
  discardObservationButton: {
    id: 'AppContainer.EditHeader.discardObservationButton',
    defaultMessage: 'Discard Observation',
    description: 'Title of dialog that shows when cancelling observation edits',
  },
});

type HeaderLeftProps = {
  headerBackButtonProps: HeaderBackButtonProps;
};

export const HeaderLeft = ({headerBackButtonProps}: HeaderLeftProps) => {
  const {closeSheet, openSheet, isOpen, sheetRef} = useBottomSheetModal({
    openOnMount: false,
  });
  const {formatMessage} = useIntl();
  const {clearDraft} = useDraftObservation();
  const navigation = useNavigationFromRoot();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        openSheet();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [openSheet]),
  );

  function handleDiscard() {
    clearDraft();
    closeSheet();
    navigation.dispatch(
      CommonActions.reset({index: 0, routes: [{name: 'Home'}]}),
    );
  }

  return (
    <>
      <HeaderLeftClose
        onPress={openSheet}
        headerBackButtonProps={headerBackButtonProps}
      />
      <BottomSheetModal isOpen={isOpen} ref={sheetRef}>
        <ConfirmDiscardBottomSheetContent
          closeSheet={closeSheet}
          handleDiscard={handleDiscard}
          header={formatMessage(m.discardTitle)}
          subHeader={formatMessage(m.discardObservationDescription)}
          discardButtonText={formatMessage(m.discardObservationButton)}
          discardButtonCancel={formatMessage(m.discardCancel)}
        />
      </BottomSheetModal>
    </>
  );
};
