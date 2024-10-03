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
  onDelete: () => void;
  onRecordAnother: () => void;
}

type ModalContentType = 'delete' | 'success' | null;

export function RecordingDone({
  duration,
  uri,
  onDelete,
  onRecordAnother,
}: RecordingDoneProps) {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const {addAudioRecording} = useDraftObservation();

  const [modalContentType, setModalContentType] =
    useState<ModalContentType>(null);

  const {
    sheetRef,
    isOpen: isModalOpen,
    openSheet,
    closeSheet,
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

  const handleDelete = async () => {
    await closeSheet();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('ObservationCreate');
    }
    onDelete();
  };

  const handleReturnToEditor = () => {
    closeSheet();
    navigation.navigate('ObservationCreate');
  };

  const handleRecordAnother = async () => {
    closeSheet();
    await onRecordAnother();
    navigation.navigate('Audio');
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
        <View style={{marginTop: 80}}>
          <BottomSheetModalContent
            icon={<SuccessIcon />}
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
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <Playback
        uri={uri}
        leftControl={
          <Pressable
            onPress={() => {
              setModalContentType('delete');
              openSheet();
            }}>
            <MaterialIcon name="delete" color={WHITE} size={36} />
          </Pressable>
        }
      />
      <BottomSheetModal
        ref={sheetRef}
        isOpen={isModalOpen}
        fullScreen={modalContentType === 'success'}>
        {renderModalContent()}
      </BottomSheetModal>
    </>
  );
}
