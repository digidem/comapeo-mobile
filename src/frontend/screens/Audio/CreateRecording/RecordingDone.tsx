import React, {useEffect, useState} from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import {Pressable, Text, View} from 'react-native';
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
import SuccessIcon from '../../../images/GreenCheck.svg';
import {Playback} from '../../../sharedComponents/Playback';
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
  successTitle: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.successTitle',
    defaultMessage: 'Success!',
  },
  successDescription: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.successDescription',
    defaultMessage: 'Your <bold>{audioRecording}</bold> was added.',
  },
  returnToEditorButtonText: {
    id: 'AudioPlaybackScreen.SuccessAudioRecordingModal.returnToEditor',
    defaultMessage: 'Return to Editor',
  },
  recordAnotherButtonText: {
    id: 'AudioPlaybackScreen.SuccessAudioRecordingModal.recordAnother',
    defaultMessage: 'Record Another',
  },
  audioRecording: {
    id: 'AudioPlaybackScreen.SuccessAudioRecordingModal.audioRecording',
    defaultMessage: 'Audio Recording',
  },
});

interface RecordingDoneProps {
  duration: number;
  uri: string;
  reset: () => void;
}

type ModalContentType = 'delete' | 'success' | null;
type PendingAction = 'delete' | 'returnToEditor' | 'recordAnother' | null;

export function RecordingDone({duration, uri, reset}: RecordingDoneProps) {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const {addAudioRecording} = useDraftObservation();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const [modalContentType, setModalContentType] =
    useState<ModalContentType>(null);

  const {sheetRef, isOpen, openSheet, closeSheet} = useBottomSheetModal({
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
              createdAt: Date.now(),
              duration,
              uri,
            };
            addAudioRecording(audioRecording);
            setModalContentType('success');
            openSheet();
          }}
          backImage={props => <CloseIcon color={props.tintColor} />}
        />
      ),
    });
  }, [navigation, addAudioRecording, duration, uri, openSheet]);

  const handleDelete = () => {
    closeSheet();
    setPendingAction('delete');
    reset();
  };

  const handleDeletePress = () => {
    setModalContentType('delete');
    openSheet();
  };

  const handleReturnToEditor = () => {
    closeSheet();
    setPendingAction('returnToEditor');
  };

  const handleRecordAnother = async () => {
    closeSheet();
    setPendingAction('recordAnother');
    reset();
  };

  const onModalDismiss = () => {
    switch (pendingAction) {
      case 'delete':
        navigation.goBack();
        break;
      case 'returnToEditor':
        navigation.navigate('ObservationCreate');
        break;
      case 'recordAnother':
        navigation.navigate('Audio');
        break;
      default:
        break;
    }
    setPendingAction(null);
  };

  const renderModalContent = () => {
    if (modalContentType === 'delete') {
      return (
        <BottomSheetModalContent
          icon={<ErrorIcon />}
          title={t(m.deleteBottomSheetTitle)}
          description={t(m.deleteBottomSheetDescription)}
          buttonConfigs={[
            {
              dangerous: true,
              text: t(m.deleteBottomSheetPrimaryButtonText),
              icon: <DeleteIcon color={WHITE} />,
              onPress: handleDelete,
              variation: 'filled',
            },
            {
              variation: 'outlined',
              text: t(m.deleteBottomSheetSecondaryButtonText),
              onPress: closeSheet,
            },
          ]}
        />
      );
    } else if (modalContentType === 'success') {
      const description = (
        <View style={{marginTop: 40}}>
          <Text style={{fontSize: 16}}>
            <FormattedMessage
              {...m.successDescription}
              values={{
                audioRecording: t(m.audioRecording),
                bold: message => (
                  <Text style={{fontWeight: 'bold'}}>{message}</Text>
                ),
              }}
            />
          </Text>
        </View>
      );
      return (
        <BottomSheetModalContent
          icon={<SuccessIcon style={{marginTop: 80}} />}
          title={t(m.successTitle)}
          description={description}
          buttonConfigs={[
            {
              text: t(m.returnToEditorButtonText),
              onPress: handleReturnToEditor,
              variation: 'outlined',
            },
            {
              text: t(m.recordAnotherButtonText),
              onPress: handleRecordAnother,
              variation: 'filled',
            },
          ]}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Playback
        uri={uri}
        leftControl={
          <Pressable onPress={handleDeletePress}>
            <MaterialIcon name="delete" color={WHITE} size={36} />
          </Pressable>
        }
      />
      <BottomSheetModal
        isOpen={isOpen}
        ref={sheetRef}
        onDismiss={onModalDismiss}
        fullScreen={modalContentType === 'success'}>
        {renderModalContent()}
      </BottomSheetModal>
    </>
  );
}
