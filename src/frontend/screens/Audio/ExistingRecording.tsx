import React, {useEffect} from 'react';
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
  onDelete: () => void;
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

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: (props: HeaderBackButtonProps) => (
        <HeaderBackButton
          {...props}
          onPress={() => navigation.goBack()}
          backImage={props => <CloseIcon color={props.tintColor} />}
        />
      ),
    });
  }, [navigation]);

  const handleDelete = () => {
    closeSheet();
    onDelete();
  };

  const handleShare = async () => {
    try {
      await Share.open({url: uri});
    } catch (err) {
      console.error('Error sharing file:', err);
    }
  };

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
            <Pressable onPress={handleShare}>
              <MaterialIcon name="share" color={WHITE} size={36} />
            </Pressable>
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
