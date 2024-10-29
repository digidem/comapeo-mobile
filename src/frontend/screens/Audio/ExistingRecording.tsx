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
  uri: string;
  isSavedUri: boolean;
}

export const ExistingRecording: React.FC<ExistingRecordingProps> = ({
  onDelete,
  isEditing,
  uri,
  isSavedUri = false,
}) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigation();
  const {sheetRef, isOpen, openSheet, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  const [localUri, setLocalUri] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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

  const handleDelete = () => {
    closeSheet();
    onDelete();
  };

  const handleShare = useCallback(async () => {
    setShareLoading(true);
    try {
      let fileUri = localUri;

      if (!fileUri) {
        if (!uri) {
          throw new Error('No audio URI provided.');
        }
        if (isSavedUri) {
          const tempFileName = `audio_${Date.now()}.m4a`;
          const localFilePath = `${FileSystem.cacheDirectory}${tempFileName}`;
          const downloadResult = await FileSystem.downloadAsync(
            uri,
            localFilePath,
          );
          fileUri = downloadResult.uri;
          setLocalUri(fileUri);
        } else {
          fileUri = uri;
        }
      }

      await Share.open({url: fileUri, failOnCancel: false});
    } catch (err) {
      setError(err as Error);
    } finally {
      setShareLoading(false);
    }
  }, [uri, isSavedUri, localUri]);

  useEffect(() => {
    return () => {
      if (localUri && isSavedUri) {
        FileSystem.deleteAsync(localUri, {idempotent: true}).catch(() => {});
      }
    };
  }, [localUri, isSavedUri]);

  return (
    <>
      <View style={styles.container}>
        <Playback
          uri={localUri || uri}
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
                {shareLoading ? (
                  <UIActivityIndicator size={24} color={WHITE} />
                ) : (
                  <MaterialIcon name="share" color={WHITE} size={36} />
                )}
              </Pressable>
            ) : null
          }
        />
      </View>
      <ErrorBottomSheet error={error} clearError={() => setError(null)} />
      <BottomSheetModal
        isOpen={isOpen}
        ref={sheetRef}
        onDismiss={handleBackPress}>
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
