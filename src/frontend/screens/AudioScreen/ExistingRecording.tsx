import {HeaderBackButton} from '@react-navigation/elements';
import React, {useEffect} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Pressable} from 'react-native';

import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import ErrorIcon from '../../images/Error.svg';
import {WHITE} from '../../lib/styles';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import {CloseIcon, DeleteIcon} from '../../sharedComponents/icons';
import {Playback} from './Playback';

const m = defineMessages({
  deleteBottomSheetTitle: {
    id: 'screens.AudioScreen.ExistingRecording.deleteBottomSheetTitle',
    defaultMessage: 'Delete?',
  },
  deleteBottomSheetDescription: {
    id: 'screens.AudioScreen.ExistingRecording.deleteBottomSheetTitle',
    defaultMessage:
      'Your Audio Recording will be permanently deleted. This cannot be undone.',
  },
  deleteBottomSheetPrimaryButtonText: {
    id: 'screens.AudioScreen.ExistingRecording.deleteBottomSheetPrimaryButtonText',
    defaultMessage: 'Delete',
  },
  deleteBottomSheetSecondaryButtonText: {
    id: 'screens.AudioScreen.ExistingRecording.deleteBottomSheetSecondaryButtonText',
    defaultMessage: 'Cancel',
  },
});

export function ExistingRecording({uri}: {uri: string}) {
  const {formatMessage: t} = useIntl();
  const deleteModal = useBottomSheetModal({
    openOnMount: false,
  });
  const navigation = useNavigationFromRoot();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            navigation.goBack();
          }}
          backImage={props => <CloseIcon color={props.tintColor} />}
        />
      ),
    });
  }, [navigation]);

  return (
    <>
      <Playback
        uri={uri}
        leftControl={
          <Pressable onPress={deleteModal.openSheet}>
            <DeleteIcon />
          </Pressable>
        }
      />
      <BottomSheetModal ref={deleteModal.sheetRef} isOpen={deleteModal.isOpen}>
        <BottomSheetContent
          icon={<ErrorIcon />}
          title={t(m.deleteBottomSheetTitle)}
          description={t(m.deleteBottomSheetDescription)}
          buttonConfigs={[
            {
              dangerous: true,
              text: t(m.deleteBottomSheetPrimaryButtonText),
              icon: <DeleteIcon color={WHITE} />,
              onPress: () => {
                // TODO: Delete recording from observation
                deleteModal.closeSheet();
              },
              variation: 'filled',
            },
            {
              variation: 'outlined',
              text: t(m.deleteBottomSheetSecondaryButtonText),
              onPress: () => {
                deleteModal.closeSheet();
              },
            },
          ]}
        />
      </BottomSheetModal>
    </>
  );
}
