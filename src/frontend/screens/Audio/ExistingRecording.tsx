import React, {useEffect, useState} from 'react';
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
  uri: string;
  onDelete: (isSavedAudio: boolean) => void;
  isEditing: boolean;
}

export const ExistingRecording: React.FC<ExistingRecordingProps> = ({
  uri,
  onDelete,
  isEditing,
}) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigation();
  const {sheetRef, isOpen, openSheet, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });
  const isRemoteUri = (url: string): boolean => {
    try {
      const parsedUri = new URL(url);
      return parsedUri.protocol === 'http:' || parsedUri.protocol === 'https:';
    } catch (e) {
      // if url doesn't meet these conditions return false
      return false;
    }
  };

  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: (props: HeaderBackButtonProps) => (
        <HeaderBackButton
          {...props}
          onPress={() => navigation.goBack()}
          backImage={backImageProps => (
            <CloseIcon color={backImageProps.tintColor} />
          )}
        />
      ),
    });
  }, [navigation]);

  const handleDelete = () => {
    closeSheet();
    onDelete(isRemoteUri(uri));
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      if (!localUri) {
        const tempFileName = `audio_${Date.now()}.m4a`;
        const localFilePath = `${FileSystem.cacheDirectory}${tempFileName}`;
        const downloadResult = await FileSystem.downloadAsync(
          uri,
          localFilePath,
        );
        setLocalUri(downloadResult.uri);
      }
      await Share.open({url: localUri!});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (localUri) {
        FileSystem.deleteAsync(localUri, {idempotent: true}).catch(() => {});
      }
    };
  }, [localUri]);

  return (
    <>
      <View style={styles.container}>
        <Playback
          uri={uri}
          leftControl={
            isEditing ? (
              <Pressable onPress={openSheet}>
                <MaterialIcon name="delete" color={WHITE} size={36} />
              </Pressable>
            ) : null
          }
          rightControl={
            loading ? (
              <UIActivityIndicator size={24} color={WHITE} />
            ) : isRemoteUri(uri) ? (
              <Pressable onPress={handleShare}>
                <MaterialIcon name="share" color={WHITE} size={36} />
              </Pressable>
            ) : null
          }
        />
      </View>
      <BottomSheetModal
        isOpen={isOpen}
        ref={sheetRef}
        onDismiss={() => {
          navigation.goBack();
        }}>
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
