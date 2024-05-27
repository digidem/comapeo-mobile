import React, {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {
  BottomSheetContent,
  BottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Error from '../../images/Error.svg';
import {WHITE} from '../../lib/styles';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

interface AudioRecordingDeleteBottomSheet {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  isOpen: boolean;
  closeSheet: () => void;
}

export const AudioRecordingDeleteBottomSheet: FC<
  AudioRecordingDeleteBottomSheet
> = ({sheetRef, isOpen, closeSheet}) => {
  const {formatMessage} = useIntl();
  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
      <BottomSheetContent
        loading={false}
        buttonConfigs={[
          {
            variation: 'filled',
            dangerous: true,
            onPress: () => {},
            text: formatMessage(m.deleteButtonText),
            icon: <MaterialIcons size={35} name="delete" color={WHITE} />,
          },
          {
            variation: 'outlined',
            onPress: closeSheet,
            text: formatMessage(m.cancelButtonText),
          },
        ]}
        title={formatMessage(m.deleteModalTitle)}
        titleStyle={styles.title}
        description={
          <FormattedMessage
            {...m.deleteModalDescription}
            values={{
              audioRecording: 'Audio Recording',
              bold: message => <Text style={styles.textBold}>{message}</Text>,
            }}
          />
        }
        descriptionStyle={styles.description}
        icon={<Error />}
      />
    </BottomSheetModal>
  );
};

const m = defineMessages({
  deleteModalTitle: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.deleteTitle',
    defaultMessage: 'Delete?',
  },
  deleteModalDescription: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.deleteDescription',
    defaultMessage:
      'Your <bold>{audioRecording}</bold> will be permanently deleted. This cannot be undone.',
  },
  deleteButtonText: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.deleteButtonText',
    defaultMessage: 'Delete',
  },
  cancelButtonText: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.cancelButtonText',
    defaultMessage: 'Cancel',
  },
});

const styles = StyleSheet.create({
  title: {fontWeight: 'bold', fontSize: 24},
  description: {fontSize: 16},
  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
