import * as React from 'react';
import {HeaderLeftClose} from '../../sharedComponents/HeaderLeftClose';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  BottomSheetModal,
  useBottomSheetModal,
  BottomSheetModalContent,
} from '../../sharedComponents/BottomSheetModal';
import {defineMessages, useIntl} from 'react-intl';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import DiscardIcon from '../../images/delete.svg';
import ErrorIcon from '../../images/Error.svg';

const m = defineMessages({
  discardTitle: {
    id: 'SaveTrack.HeaderLeft.discardTitle',
    defaultMessage: 'Discard Track?',
    description: 'Title of dialog that shows when cancelling track edits',
  },
  discardTrackDescription: {
    id: 'SaveTrack.HeaderLeft.discardTrackDescription',
    defaultMessage: 'Your Track will not be saved. This cannot be undone.',
  },
  discardCancel: {
    id: 'SaveTrack.HeaderLeft.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
  discardTrackButton: {
    id: 'SaveTrack.HeaderLeft.discardTrackButton',
    defaultMessage: 'Discard Track',
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
  const clearCurrentTrack = usePersistedTrack(state => state.clearCurrentTrack);
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
        <BottomSheetModalContent
          buttonConfigs={[
            {
              variation: 'filled',
              dangerous: true,
              onPress: handleDiscard,
              text: formatMessage(m.discardTrackButton),
              icon: <DiscardIcon />,
            },
            {
              onPress: closeSheet,
              text: formatMessage(m.discardCancel),
              variation: 'outlined',
            },
          ]}
          title={formatMessage(m.discardTitle)}
          description={formatMessage(m.discardTrackDescription)}
          icon={<ErrorIcon width={60} height={60} />}
        />
      </BottomSheetModal>
    </>
  );
};
