import React, {useEffect} from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {defineMessages, useIntl} from 'react-intl';
import {Pressable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {WHITE} from '../../../lib/styles';
import {
  BottomSheetModalContent,
  BottomSheetModal,
  useBottomSheetModal,
} from '../../../sharedComponents/BottomSheetModal';
import {CloseIcon, DeleteIcon} from '../../../sharedComponents/icons';
import ErrorIcon from '../../../images/Error.svg';
import {Playback} from '../Playback';

const m = defineMessages({
  deleteBottomSheetTitle: {
    id: 'screens.AudioScreen.CreateRecording.RecordingDone.deleteBottomSheetTitle',
    defaultMessage: 'Delete?',
  },
  deleteBottomSheetDescription: {
    id: 'screens.AudioScreen.CreateRecording.RecordingDone.deleteBottomSheetDescription',
    defaultMessage:
      'Your Audio Recording will be permanently deleted. This cannot be undone.',
  },
  deleteBottomSheetPrimaryButtonText: {
    id: 'screens.AudioScreen.CreateRecording.RecordingDone.deleteBottomSheetPrimaryButtonText',
    defaultMessage: 'Delete',
  },
  deleteBottomSheetSecondaryButtonText: {
    id: 'screens.AudioScreen.CreateRecording.RecordingDone.deleteBottomSheetSecondaryButtonText',
    defaultMessage: 'Cancel',
  },
});

export function RecordingDone({
  uri,
  onDelete,
}: {
  uri: string;
  onDelete: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const {sheetRef, isOpen, closeSheet, openSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            onDelete();
          }}
          backImage={props => <CloseIcon color={props.tintColor} />}
        />
      ),
    });
  }, [navigation, onDelete]);

  return (
    <>
      <Playback
        uri={uri}
        leftControl={
          <Pressable onPress={openSheet}>
            <MaterialIcon name="delete" color={WHITE} size={36} />
          </Pressable>
        }
      />
      <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
        <BottomSheetModalContent
          icon={<ErrorIcon />}
          title={t(m.deleteBottomSheetTitle)}
          description={t(m.deleteBottomSheetDescription)}
          buttonConfigs={[
            {
              dangerous: true,
              text: t(m.deleteBottomSheetPrimaryButtonText),
              icon: <DeleteIcon color={WHITE} />,
              onPress: () => {
                closeSheet();
                onDelete();
              },
              variation: 'filled',
            },
            {
              variation: 'outlined',
              text: t(m.deleteBottomSheetSecondaryButtonText),
              onPress: () => {
                closeSheet();
              },
            },
          ]}
        />
      </BottomSheetModal>
    </>
  );
}
