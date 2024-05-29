import React, {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {
  BottomSheetContent,
  BottomSheetModal,
} from '../../../sharedComponents/BottomSheetModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Error from '../../../images/Error.svg';
import {WHITE} from '../../../lib/styles';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes.ts';
import {useDraftObservation} from '../../../hooks/useDraftObservation.ts';
import {
  useEditObservation,
  useMaybeObservation,
} from '../../../hooks/server/observations.ts';

interface AudioRecordingDeleteBottomSheet {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  isOpen: boolean;
  recordingUri: string;
  previewOnly?: boolean;
  attachmentId?: string;
  observationId?: string;
  closeSheet: () => void;
}

export const AudioRecordingDeleteBottomSheet: FC<
  AudioRecordingDeleteBottomSheet
> = ({
  sheetRef,
  isOpen,
  closeSheet,
  recordingUri,
  attachmentId,
  observationId,
  previewOnly,
}) => {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromRoot();
  const draftObservation = useDraftObservation();
  const {data: observation, isPending: observationPending} =
    useMaybeObservation(observationId);
  const editObservation = useEditObservation();

  const handleRecordingDelete = async () => {
    closeSheet();
    if (attachmentId && observationId) {
      console.log(observation);
      console.log(attachmentId);
      editObservation.mutate({
        versionId: observation!.versionId,
        value: {
          ...observation!,
          attachments: observation!.attachments.filter(
            attachment => attachment.driveDiscoveryId !== attachmentId,
          ),
        },
      });
      navigation.goBack();
      return;
    }
    if (previewOnly) {
      draftObservation.removeAudioRecording(recordingUri);
      navigation.goBack();
      return;
    }
    await RNFS.unlink(new URL(recordingUri).pathname);
    navigation.replace('ObservationEdit');
  };

  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
      <BottomSheetContent
        loading={
          !!attachmentId && (observationPending || editObservation.isPending)
        }
        buttonConfigs={[
          {
            variation: 'filled',
            dangerous: true,
            onPress: handleRecordingDelete,
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
              audioRecording: formatMessage(m.audioRecording),
              // eslint-disable-next-line react/no-unstable-nested-components
              bold: msg => <Text style={styles.textBold} children={msg} />,
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
  audioRecording: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.audioRecording',
    defaultMessage: 'Audio Recording',
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
