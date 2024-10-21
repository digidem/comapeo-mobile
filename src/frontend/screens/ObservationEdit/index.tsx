import * as React from 'react';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {Editor} from '../../sharedComponents/Editor';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {useEditObservation} from '../../hooks/server/observations';
import {
  useCreateBlobMutation,
  useCreateAudioBlobMutation,
} from '../../hooks/server/media';
import {SaveButton} from '../../sharedComponents/SaveButton';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {ActionsRow} from '../../sharedComponents/ActionRow';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {Loading} from '../../sharedComponents/Loading';
import {HeaderLeft} from './HeaderLeft';
import {ProcessedDraftPhoto} from '../../contexts/PhotoPromiseContext/types';
import {CommonActions} from '@react-navigation/native';
import {matchPreset} from '../../lib/utils.ts';
import {StoredAudioRecording, AudioRecording} from '../../sharedTypes/index.ts';

const m = defineMessages({
  observation: {
    id: 'screens.ObservationEdit.observation',
    defaultMessage: 'Observation',
    description: 'Default name of observation with no matching preset',
  },
  navTitle: {
    id: 'screens.ObservationEdit.navTitle',
    defaultMessage: 'Edit Observation',
    description: 'screen title for new observation screen',
  },
  changePreset: {
    id: 'screens.ObservationEdit.changePreset',
    defaultMessage: 'Change',
  },
  descriptionPlaceholder: {
    id: 'screens.ObservationEdit.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

export const ObservationEdit: NativeNavigationComponent<'ObservationEdit'> = ({
  navigation,
  route,
}) => {
  const {formatMessage} = useIntl();
  const {projectApi} = useActiveProject();

  const value = usePersistedDraftObservation(store => store.value);
  const {updateTags, clearDraft, usePreset, existingObservationToDraft} =
    useDraftObservation();
  const preset = usePreset();
  const editObservationMutation = useEditObservation();
  const photos = usePersistedDraftObservation(store => store.photos);
  const audioRecordings = usePersistedDraftObservation(
    store => store.audioRecordings,
  );

  const createBlobMutation = useCreateBlobMutation();
  const createAudioBlobMutation = useCreateAudioBlobMutation();

  const notes = value?.tags.notes;
  const presetName = preset
    ? formatMessage({
        id: `presets.${preset.docId}.name`,
        defaultMessage: preset.name,
      })
    : formatMessage(m.observation);

  // TODO: This shouldn't be an effect, the logic should happen when the user
  // presses the edit button.
  React.useEffect(() => {
    let cancelled = false;
    if (value) return;
    if (!route.params?.observationId) {
      navigation.goBack();
      return;
    }

    async function createDraftFromExistingObservation(docId: string) {
      const observation = await projectApi.observation.getByDocId(docId);
      if (cancelled) return;
      const audioAttachments =
        observation.attachments.filter(
          (attachment): attachment is StoredAudioRecording =>
            attachment.type === 'audio',
        ) || [];
      let processedAudioRecordings: AudioRecording[] = [];
      if (audioAttachments.length > 0) {
        processedAudioRecordings = await Promise.all(
          audioAttachments.map(async attachment => {
            const url = await projectApi.$blobs.getUrl({
              driveId: attachment.driveDiscoveryId,
              name: attachment.name,
              type: attachment.type as 'audio',
              variant: 'original',
            });
            return {
              uri: url,
              createdAt: 0, // placeholder
              duration: 0, // placeholder
            } as AudioRecording;
          }),
        );
      }

      const presets = await projectApi.preset.getMany();
      if (cancelled) return;
      let matchingPreset;
      if (observation.presetRef) {
        matchingPreset = presets.find(
          p => p.docId === observation.presetRef?.docId,
        );
      }
      if (!matchingPreset) {
        matchingPreset = matchPreset(observation.tags, presets);
      }
      existingObservationToDraft(
        observation,
        matchingPreset,
        processedAudioRecordings,
      );
    }

    createDraftFromExistingObservation(route.params?.observationId);

    return () => {
      cancelled = true;
    };
  }, [
    value,
    existingObservationToDraft,
    route.params?.observationId,
    projectApi.observation,
    projectApi.preset,
    navigation,
    audioRecordings,
    projectApi.$blobs,
  ]);

  const handleNavigationSuccess = React.useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
    }
    clearDraft();
  }, [navigation, clearDraft]);

  const editObservation = React.useCallback(async () => {
    if (!value) {
      throw new Error('no observation saved in persisted state');
    }

    if (!('versionId' in value)) {
      throw new Error('Cannot update a unsaved observation (must create one)');
    }

    const newPhotos = photos.filter(
      (photo): photo is ProcessedDraftPhoto => photo.type === 'processed',
    );

    const audioAttachments = value.attachments.filter(
      attachment => attachment.type === 'audio',
    );

    const removedAudioAttachments = audioAttachments.filter(attachment => {
      const existsInRecordings = audioRecordings.some(recording => {
        const url = new URL(recording.uri);
        const pathSegments = url.pathname.split('/');
        const name = pathSegments[pathSegments.length - 1];
        return name === attachment.name;
      });
      return !existsInRecordings;
    });

    const newAudioRecordings = audioRecordings.filter(recording =>
      recording.uri.startsWith('file://'),
    );

    const attachmentsChanged =
      newPhotos.length > 0 ||
      newAudioRecordings.length > 0 ||
      removedAudioAttachments.length > 0;

    if (!attachmentsChanged) {
      return editObservationMutation.mutate(
        {
          versionId: value.versionId,
          value: {
            ...value,
            presetRef: preset
              ? {docId: preset.docId, versionId: preset.versionId}
              : undefined,
          },
        },
        {onSuccess: handleNavigationSuccess},
      );
    }

    const newAttachments = await Promise.all([
      ...newPhotos.map(photo => createBlobMutation.mutateAsync(photo)),
      ...newAudioRecordings.map(audio =>
        createAudioBlobMutation.mutateAsync(audio),
      ),
    ]).then(results =>
      results.map(({driveId, type, name, hash}) => ({
        driveDiscoveryId: driveId,
        type,
        name,
        hash,
      })),
    );

    const updatedAttachments = [
      ...value.attachments.filter(
        attachment =>
          !removedAudioAttachments.some(
            removed => removed.name === attachment.name,
          ),
      ),
      ...newAttachments,
    ];

    editObservationMutation.mutate(
      {
        versionId: value.versionId,
        value: {
          ...value,
          attachments: updatedAttachments,
          presetRef: preset
            ? {docId: preset.docId, versionId: preset.versionId}
            : undefined,
        },
      },
      {onSuccess: handleNavigationSuccess},
    );
  }, [
    preset,
    value,
    editObservationMutation,
    photos,
    createBlobMutation,
    audioRecordings,
    handleNavigationSuccess,
    createAudioBlobMutation,
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <SaveButton
          onPress={editObservation}
          isLoading={editObservationMutation.isPending}
        />
      ),
    });
  }, [editObservation, editObservationMutation, navigation]);

  return !value ? (
    <Loading />
  ) : (
    <>
      <Editor
        presetName={presetName}
        PresetIcon={
          <PresetCircleIcon
            size="medium"
            iconId={preset?.iconRef?.docId}
            testID={`OBS.${preset?.name}-icon`}
          />
        }
        onPressPreset={() => navigation.navigate('PresetChooser')}
        notes={typeof notes !== 'string' ? '' : notes}
        updateNotes={newVal => {
          updateTags('notes', newVal);
        }}
        photos={photos}
        audioRecordings={audioRecordings}
        actionsRow={
          <ActionsRow fieldRefs={preset?.fieldRefs} isEditing={true} />
        }
        isEditing={true}
      />
      <ErrorBottomSheet
        error={editObservationMutation.error || createBlobMutation.error}
        clearError={() => {
          editObservationMutation.reset();
          createBlobMutation.reset();
        }}
        tryAgain={editObservation}
      />
    </>
  );
};

ObservationEdit.navTitle = m.navTitle;

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.navTitle),
      headerRight: () => <SaveButton onPress={() => {}} isLoading={false} />,
      headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
    };
  };
}
