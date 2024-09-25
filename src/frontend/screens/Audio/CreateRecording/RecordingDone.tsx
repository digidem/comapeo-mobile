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
import {RecordingSuccessModal} from '../RecordingSuccessModal';
import {useDraftObservation} from '../../../hooks/useDraftObservation';

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
  createdAt,
  duration,
  uri,
  onDelete,
  onRecordAnother,
}: {
  createdAt: number;
  duration: number;
  uri: string;
  onDelete: () => void;
  onRecordAnother: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const {addAudio} = useDraftObservation();
  const {
    sheetRef: deleteSheetRef,
    isOpen: isDeleteSheetOpen,
    openSheet: openDeleteSheet,
    closeSheet: closeDeleteSheet,
  } = useBottomSheetModal({
    openOnMount: false,
  });

  const {
    sheetRef: successSheetRef,
    isOpen: isSuccessSheetOpen,
    openSheet: openSuccessSheet,
    closeSheet: closeSuccessSheet,
  } = useBottomSheetModal({
    openOnMount: false,
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            const audioRecording = {
              createdAt,
              duration,
              uri,
            };
            addAudio(audioRecording);
            openSuccessSheet();
          }}
          backImage={props => <CloseIcon color={props.tintColor} />}
        />
      ),
    });
  }, [navigation, openSuccessSheet]);

  const handleReturnToEditor = () => {
    closeSuccessSheet();
    navigation.navigate('ObservationCreate');
  };

  const handleRecordAnother = async () => {
    closeSuccessSheet();
    await onRecordAnother();
    navigation.navigate('Audio');
  };

  return (
    <>
      <Playback
        uri={uri}
        leftControl={
          <Pressable onPress={openDeleteSheet}>
            <MaterialIcon name="delete" color={WHITE} size={36} />
          </Pressable>
        }
      />
      <BottomSheetModal ref={deleteSheetRef} isOpen={isDeleteSheetOpen}>
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
                closeDeleteSheet();
                onDelete();
              },
              variation: 'filled',
            },
            {
              variation: 'outlined',
              text: t(m.deleteBottomSheetSecondaryButtonText),
              onPress: () => {
                closeDeleteSheet();
              },
            },
          ]}
        />
      </BottomSheetModal>
      <RecordingSuccessModal
        sheetRef={successSheetRef}
        isOpen={isSuccessSheetOpen}
        onReturnToEditor={handleReturnToEditor}
        onRecordAnother={handleRecordAnother}
      />
    </>
  );
}
