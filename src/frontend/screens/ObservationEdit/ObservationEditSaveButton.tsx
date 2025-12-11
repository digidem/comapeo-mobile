import {useUpdateDocument} from '@comapeo/core-react';
import {
  usePersistedDraftObservation,
  usePreset,
} from '../../hooks/persistedState/usePersistedDraftObservation';
import {
  useCreatePhotoAttachment,
  useCreateAudioAttachment,
} from '../../hooks/server/media';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {STORAGE_QUERY_KEY} from '../../hooks/useStorageReadingQuery';
import SaveCheck from '../../images/CheckMark.svg';
import {
  isAudioAttachment,
  isProcessedDraftPhoto,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';
import {IconButton} from '../../sharedComponents/IconButton';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import * as Sentry from '@sentry/react-native';

import {View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {useQueryClient} from '@tanstack/react-query';
import {AudioAttachment} from '../../sharedTypes/audio';

export const ObservationEditSaveButton = () => {
  const value = usePersistedDraftObservation(store => store.value);
  const attachments = usePersistedDraftObservation(store => store.attachments);
  const {clearDraft} = useDraftObservation();
  const navigation = useNavigationFromRoot();
  const {projectId} = useActiveProject();
  const preset = usePreset();
  const queryClient = useQueryClient();

  const {
    mutateAsync: createPhotoAttachmentAsync,
    status: photoAttachmentStatus,
  } = useCreatePhotoAttachment({projectId});

  const {
    mutateAsync: createAudioAttachmentAsync,
    status: audioAttachmentStatus,
  } = useCreateAudioAttachment({projectId});

  const {mutateAsync: updateObservationAsync, status: observationStatus} =
    useUpdateDocument({
      docType: 'observation',
      projectId,
    });

  const isLoading =
    photoAttachmentStatus === 'pending' ||
    audioAttachmentStatus === 'pending' ||
    observationStatus === 'pending';

  async function handlePressSave() {
    if (!value) {
      throw new Error('no observation saved in persisted state');
    }
    if (!('versionId' in value)) {
      throw new Error('Cannot update a unsaved observation (must create one)');
    }

    const newPhotos = attachments.filter(isProcessedDraftPhoto);

    const removedAudioAttachments = attachments.filter(
      (attachment): attachment is AudioAttachment =>
        isAudioAttachment(attachment) && attachment.deleted === true,
    );

    const newAudioRecordings = attachments.filter(isUnsavedAudio);

    const attachmentsChanged =
      newPhotos.length > 0 ||
      newAudioRecordings.length > 0 ||
      removedAudioAttachments.length > 0;

    if (!attachmentsChanged) {
      updateObservationAsync({
        versionId: value.versionId,
        value: {
          ...value,
          presetRef: preset
            ? {docId: preset.docId, versionId: preset.versionId}
            : undefined,
        },
      })
        .then(() => {
          handleSaveSuccess();
        })
        .catch(err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        });

      return;
    }

    try {
      const newAttachments = await Promise.all([
        ...newPhotos.map(p => {
          return createPhotoAttachmentAsync(p);
        }),
        ...newAudioRecordings.map(a => {
          return createAudioAttachmentAsync(a);
        }),
      ]);

      const updatedAttachments = [
        ...value.attachments.filter(
          attachment =>
            !removedAudioAttachments.some(
              removed => removed.name === attachment.name,
            ),
        ),
        ...newAttachments,
      ];

      await updateObservationAsync({
        versionId: value.versionId,
        value: {
          ...value,
          attachments: updatedAttachments,
          presetRef: preset
            ? {docId: preset.docId, versionId: preset.versionId}
            : undefined,
        },
      }).then(() => {
        queryClient.invalidateQueries({queryKey: STORAGE_QUERY_KEY});
        handleSaveSuccess();
      });
    } catch (err) {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet');
      return;
    }
  }

  function handleSaveSuccess() {
    clearDraft();
    navigation.goBack();
  }

  return isLoading ? (
    <View style={{marginRight: 10}}>
      <UIActivityIndicator size={30} />
    </View>
  ) : (
    <IconButton onPress={handlePressSave} testID="OBS.edit-save-btn">
      <SaveCheck />
    </IconButton>
  );
};
