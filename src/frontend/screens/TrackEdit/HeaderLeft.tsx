import {HeaderBackButtonProps} from '@react-navigation/elements';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {BackHandler} from 'react-native';

import {useTrackActions} from '../../contexts/TrackStoreContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {
  BottomSheetModal,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import {ConfirmDiscardBottomSheetContent} from '../../sharedComponents/ConfirmDiscardBottomSheetContent';
import {HeaderLeftClose} from '../../sharedComponents/HeaderLeftClose';

const m = defineMessages({
  discardTitle: {
    id: 'TrackEdit.HeaderLeft.discardTitle',
    defaultMessage: 'Discard changes?',
    description: 'Title of dialog that shows when cancelling track edits',
  },
  discardTrackDescription: {
    id: 'TrackEdit.HeaderLeft.discardTrackDescription',
    defaultMessage: 'Your changes will not be saved. This cannot be undone.',
  },
  discardCancel: {
    id: 'TrackEdit.HeaderLeft.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
  discardTrackButton: {
    id: 'TrackEdit.HeaderLeft.discardTrackButton',
    defaultMessage: 'Discard changes',
    description: 'Button to confirm discarding the track',
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
  const {clearCurrentTrack} = useTrackActions();
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
    clearCurrentTrack();
    closeSheet();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home', params: {screen: 'Map'}}],
      }),
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
          subHeader={formatMessage(m.discardTrackDescription)}
          discardButtonText={formatMessage(m.discardTrackButton)}
          discardButtonCancel={formatMessage(m.discardCancel)}
        />
      </BottomSheetModal>
    </>
  );
};
