import {useUpdateDocument} from '@comapeo/core-react';
import {
  useCreatePhotoAttachment,
  useCreateAudioAttachment,
} from '../../hooks/server/media';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {STORAGE_QUERY_KEY} from '../../hooks/useStorageReadingQuery';
import SaveCheck from '../../images/CheckMark.svg';
import {IconButton} from '../../sharedComponents/IconButton';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import * as Sentry from '@sentry/react-native';

import {View} from 'react-native';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import {useQueryClient} from '@tanstack/react-query';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';
import {Attachment} from '../../sharedTypes';
import {
  isUnsavedAudioAttachment,
  isUnsavedPhotoAttachment,
} from '../../lib/attachmentTypeChecks';
import {toError} from '../../utils/errors';

export const ObservationEditSaveButton = () => {
  const value = useDraftObservationState(store => store.value);
  const versionId = useDraftObservationState(store => store.id?.versionId);
  const attachments = useDraftObservationState(
    store => store.unsavedAttachments,
  );
  const {clearDraft} = useDraftObservationActions();
  const navigation = useNavigationFromRoot();
  const {projectId} = useActiveProject();
  const preset = value?.presetRef;
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
    if (!versionId) {
      throw new Error('Cannot update a unsaved observation (must create one)');
    }

    let newAttachments: Attachment[] = [];

    try {
      if (attachments) {
        const photoAttachments = attachments.filter(att =>
          isUnsavedPhotoAttachment(att),
        );

        const audioAttachments = attachments.filter(att =>
          isUnsavedAudioAttachment(att),
        );

        if (photoAttachments.length > 0) {
          const photoPromises = photoAttachments.map(photo => {
            return createPhotoAttachmentAsync(photo);
          });

          newAttachments = [
            ...newAttachments,
            ...(await Promise.all(photoPromises)),
          ];
        }

        if (audioAttachments.length > 0) {
          const audioPromises = audioAttachments.map(audio => {
            return createAudioAttachmentAsync(audio);
          });

          newAttachments = [
            ...newAttachments,
            ...(await Promise.all(audioPromises)),
          ];
        }
      }

      await updateObservationAsync({
        versionId: versionId,
        value: {
          ...value,
          attachments: [...value.attachments, ...newAttachments],
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
      navigation.navigate('ErrorBottomSheet', {
        error: toError(err, 'Error saving edited observation'),
      });
      return;
    }
  }

  function handleSaveSuccess() {
    clearDraft();
    navigation.goBack();
  }

  return isLoading ? (
    <View style={{marginRight: 10}}>
      <LoadingIndicator size="large" />
    </View>
  ) : (
    <IconButton onPress={handlePressSave} testID="OBS.edit-save-btn">
      <SaveCheck />
    </IconButton>
  );
};
