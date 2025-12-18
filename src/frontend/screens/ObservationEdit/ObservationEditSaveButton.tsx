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
import {UIActivityIndicator} from 'react-native-indicators';
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
      const attachmentsArrays =
        attachments !== null ? [...attachments.entries()] : [];

      const photoAttachments = attachmentsArrays.filter(([, att]) =>
        isUnsavedPhotoAttachment(att),
      );

      const audioAttachments = attachmentsArrays.filter(([, att]) =>
        isUnsavedAudioAttachment(att),
      );

      if (photoAttachments.length > 0) {
        const photoPromises = photoAttachments.map(([, photo]) => {
          //@ts-expect-error we check type above
          return createPhotoAttachmentAsync(photo);
        });

        newAttachments = [
          ...newAttachments,
          ...(await Promise.all(photoPromises)),
        ];
      }

      if (audioAttachments.length > 0) {
        const audioPromises = audioAttachments.map(([, audio]) => {
          //@ts-expect-error we check type above
          return createAudioAttachmentAsync(audio);
        });

        newAttachments = [
          ...newAttachments,
          ...(await Promise.all(audioPromises)),
        ];
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
