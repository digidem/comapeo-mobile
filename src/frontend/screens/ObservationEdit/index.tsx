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
import {AudioRecording, StoredAudioRecording} from '../../sharedTypes/index.ts';
import {useAudioProcessing} from '../../screens/Audio/useAudioProcessing.ts';

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

  const [audioAttachments, setAudioAttachments] = React.useState<
    StoredAudioRecording[]
  >([]);

  const [processedAudioRecordings, setProcessedAudioRecordings] =
    React.useState<AudioRecording[]>([]);

  const audioWithUri = useAudioProcessing(audioAttachments);

  React.useEffect(() => {
    if (
      audioWithUri.length > 0 &&
      JSON.stringify(processedAudioRecordings) !== JSON.stringify(audioWithUri)
    ) {
      setProcessedAudioRecordings(audioWithUri);
    }
  }, [audioWithUri]);

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
      const audioAttachments =
        observation.attachments.filter(
          attachment => attachment.type === 'audio',
        ) || [];
      setAudioAttachments(audioAttachments);

      if (cancelled) return;
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
    processedAudioRecordings,
  ]);

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

    const extractDriveDiscoveryId = (uri: string) => {
      const regex = /\/([^\/]+)\/audio\/original\//;
      const match = uri.match(regex);
      return match ? match[1] : null;
    };

    const removedAudioAttachments = audioAttachments.filter(
      attachment =>
        !audioRecordings.some(
          recording =>
            extractDriveDiscoveryId(recording.uri) ===
            attachment.driveDiscoveryId,
        ),
    );

    const newAudioRecordings = audioRecordings.filter(
      recording =>
        !audioAttachments.some(
          attachment =>
            extractDriveDiscoveryId(recording.uri) ===
            attachment.driveDiscoveryId,
        ),
    );

    const audioAttachmentsChanged =
      newAudioRecordings.length > 0 || removedAudioAttachments.length > 0;

    if (!newPhotos.length && !audioAttachmentsChanged) {
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

    const filteredAttachments = value.attachments.filter(
      attachment =>
        !removedAudioAttachments.some(
          removed => removed.driveDiscoveryId === attachment.driveDiscoveryId,
        ),
    );

    editObservationMutation.mutate(
      {
        versionId: value.versionId,
        value: {
          ...value,
          attachments: [...filteredAttachments, ...newAttachments],
          presetRef: preset
            ? {docId: preset.docId, versionId: preset.versionId}
            : undefined,
        },
      },
      {onSuccess: handleNavigationSuccess},
    );
  }, [
    preset,
    navigation,
    clearDraft,
    value,
    editObservationMutation,
    photos,
    createBlobMutation,
    audioRecordings,
    audioAttachments,
  ]);

  const handleNavigationSuccess = () => {
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
  };

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
        actionsRow={<ActionsRow fieldRefs={preset?.fieldRefs} />}
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
