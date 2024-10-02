import React, {useEffect, useState} from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import {Pressable, Text, View, StyleSheet} from 'react-native';
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
import {Button} from '../../../sharedComponents/Button';

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
      );
    } else if (modalContentType === 'success') {
      return (
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <SuccessIcon />
            <Text style={styles.title}>{t(m.successTitle)}</Text>
            <Text style={styles.description}>
              <FormattedMessage
                {...m.successDescription}
                values={{
                  audioRecording: t(m.audioRecording),
                  bold: message => (
                    <Text style={styles.textBold}>{message}</Text>
                  ),
                }}
              />
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              fullWidth
              onPress={handleReturnToEditor}
              variant="outlined"
              color="ComapeoBlue">
              {t(m.returnToEditorButtonText)}
            </Button>
            <Button fullWidth onPress={handleRecordAnother}>
              {t(m.recordAnotherButtonText)}
            </Button>
          </View>
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
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 10,
  },
  description: {fontSize: 16, marginTop: 40},
  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 15,
  },
});
