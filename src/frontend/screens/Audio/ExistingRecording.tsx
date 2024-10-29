import React, {useEffect, useState, useCallback} from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import {
  HeaderBackButton,
  HeaderBackButtonProps,
} from '@react-navigation/elements';
import {useNavigation} from '@react-navigation/native';
import {useIntl, defineMessages} from 'react-intl';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Playback} from '../../sharedComponents/Playback';
import {
  BottomSheetModal,
  BottomSheetModalContent,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import {CloseIcon, DeleteIcon} from '../../sharedComponents/icons';
import {WHITE, BLACK} from '../../lib/styles';
import ErrorIcon from '../../images/Error.svg';
import Share from 'react-native-share';
import * as FileSystem from 'expo-file-system';
import {UIActivityIndicator} from 'react-native-indicators';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {
  isAudioAttachment,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';

const m = defineMessages({
  deleteBottomSheetTitle: {
    id: 'screens.AudioScreen.ExistingRecording.deleteBottomSheetTitle',
    defaultMessage: 'Delete?',
  },
  deleteBottomSheetDescription: {
    id: 'screens.AudioScreen.ExistingRecording.deleteBottomSheetDescription',
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

interface ExistingRecordingProps {
  onDelete: () => void;
  isEditing: boolean;
}

export const ExistingRecording: React.FC<ExistingRecordingProps> = ({
  onDelete,
  isEditing,
}) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigation();
  const {sheetRef, isOpen, openSheet, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });
  const selectedAudioAttachment = usePersistedDraftObservation(
    state => state.selectedAudioAttachment,
  );
  const setSelectedAudioAttachment = usePersistedDraftObservation(
    state => state.actions.setSelectedAudioAttachment,
  );
  const {projectApi} = useActiveProject();

  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isSavedUri = isAudioAttachment(selectedAudioAttachment);

  const handleBackPress = useCallback(() => {
    setSelectedAudioAttachment(null);
    navigation.goBack();
  }, [setSelectedAudioAttachment, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: (props: HeaderBackButtonProps) => (
        <HeaderBackButton
          {...props}
          onPress={handleBackPress}
          backImage={backImageProps => (
            <CloseIcon color={backImageProps.tintColor} />
          )}
        />
      ),
    });
  }, [navigation, handleBackPress]);

  useEffect(() => {
    let isCancelled = false;

    const prepareAudio = async () => {
      try {
        if (!selectedAudioAttachment) {
          throw new Error('No audio attachment selected.');
        }

        if (isUnsavedAudio(selectedAudioAttachment)) {
          setLocalUri(selectedAudioAttachment.uri);
          return;
        }

        const url = await projectApi.$blobs.getUrl({
          driveId: selectedAudioAttachment.driveDiscoveryId,
          name: selectedAudioAttachment.name,
          type: selectedAudioAttachment.type,
          variant: 'original',
        });

        const tempFileName = `audio_${Date.now()}.m4a`;
        const localFilePath = `${FileSystem.cacheDirectory}${tempFileName}`;
        const downloadResult = await FileSystem.downloadAsync(
          url,
          localFilePath,
        );

        setLocalUri(downloadResult.uri);
        return;
      } catch (err) {
        if (!isCancelled) {
          setError(err as Error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    prepareAudio();

    return () => {
      isCancelled = true;
    };
  }, [selectedAudioAttachment, isSavedUri, projectApi.$blobs]);

  useEffect(() => {
    return () => {
      if (localUri && isSavedUri) {
        FileSystem.deleteAsync(localUri, {idempotent: true}).catch(() => {});
      }
    };
  }, [localUri, isSavedUri]);

  const handleDelete = () => {
    closeSheet();
    onDelete();
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      if (!localUri) {
        throw new Error('Local audio file is not available for sharing.');
      }
      await Share.open({url: localUri, failOnCancel: false});
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {loading ? (
          <UIActivityIndicator size={48} color={WHITE} />
        ) : localUri ? (
          <Playback
            uri={localUri}
            leftControl={
              isEditing ? (
                <Pressable onPress={openSheet}>
                  <MaterialIcon name="delete" color={WHITE} size={36} />
                </Pressable>
              ) : null
            }
            rightControl={
              isSavedUri ? (
                <Pressable onPress={handleShare}>
                  <MaterialIcon name="share" color={WHITE} size={36} />
                </Pressable>
              ) : null
            }
          />
        ) : null}
      </View>
      <ErrorBottomSheet error={error} clearError={() => setError(null)} />
      <BottomSheetModal isOpen={isOpen} ref={sheetRef} onDismiss={() => {}}>
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
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    justifyContent: 'center',
  },
});
