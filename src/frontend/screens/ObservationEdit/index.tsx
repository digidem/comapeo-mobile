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
  useAttachmentUrlQueries,
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
  const savedAudioRecordings = usePersistedDraftObservation(
    store => store.audioRecordings,
  );
  const observationId = route.params?.observationId;

  const [audioAttachments, setAudioAttachments] = React.useState<any[]>([]);
  const [localObservation, setLocalObservation] = React.useState<any>(null);

  const createBlobMutation = useCreateBlobMutation();
  const createAudioBlobMutation = useCreateAudioBlobMutation();

  const notes = value?.tags.notes;
  const presetName = preset
    ? formatMessage({
        id: `presets.${preset.docId}.name`,
        defaultMessage: preset.name,
      })
    : formatMessage(m.observation);

  React.useEffect(() => {
    if (!value && observationId) {
      projectApi.observation
        .getByDocId(observationId)
        .then(observation => {
          const audioFiles = observation.attachments.filter(
            attachment => attachment.type === 'audio',
          );
          setAudioAttachments(audioFiles);
          setLocalObservation(observation);
        })
        .catch(err => {
          console.error('Failed to fetch observation:', err);
          navigation.goBack();
        });
    }
  }, [value, observationId, projectApi, navigation]);

  React.useEffect(() => {
    if (localObservation && !audioAttachments?.length) {
      existingObservationToDraft(localObservation, []);
    }
  }, [localObservation, audioAttachments, existingObservationToDraft]);

  const audioQueries = useAttachmentUrlQueries(audioAttachments, 'original');

  React.useEffect(() => {
    if (audioQueries.every(query => query.isSuccess)) {
      const audioRecordings = audioQueries
        .filter(query => query.data?.url)
        .map(query => ({
          uri: query.data!.url,
          createdAt: 0,
          duration: 0,
        }));

      if (audioRecordings?.length > 0 && localObservation) {
        existingObservationToDraft(localObservation, audioRecordings);
      }
    }
  }, [audioQueries, localObservation, existingObservationToDraft]);

  const editObservation = React.useCallback(() => {
    if (!value) {
      throw new Error('no observation saved in persisted state');
    }

    if (!('versionId' in value)) {
      throw new Error('Cannot update a unsaved observation (must create one)');
    }

    const newPhotos = photos.filter(
      (photo): photo is ProcessedDraftPhoto => photo.type === 'processed',
    );

    const audioRecordings = usePersistedDraftObservation(
      store => store.audioRecordings,
    );

    if (!newPhotos.length && !audioRecordings.length) {
      editObservationMutation.mutate(
        {versionId: value.versionId, value},
        {
          onSuccess: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Home',
                    },
                  ],
                }),
              );
            }
            clearDraft();
          },
        },
      );
      return;
    }

    const photoPromises = newPhotos.map(photo =>
      createBlobMutation.mutateAsync(photo),
    );
    const audioPromises = audioRecordings.map(audio =>
      createAudioBlobMutation.mutateAsync(audio),
    );

    Promise.all([...photoPromises, ...audioPromises]).then(results => {
      const newAttachments = results.map(
        ({driveId: driveDiscoveryId, type, name, hash}) => ({
          driveDiscoveryId,
          type,
          name,
          hash,
        }),
      );
      editObservationMutation.mutate(
        {
          versionId: value.versionId,
          value: {
            ...value,
            attachments: [...value.attachments, ...newAttachments],
          },
        },
        {
          onSuccess: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Home',
                    },
                  ],
                }),
              );
            }
            clearDraft();
          },
        },
      );
    });
  }, [
    navigation,
    clearDraft,
    value,
    editObservationMutation,
    photos,
    createBlobMutation,
    savedAudioRecordings,
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
        audioRecordings={savedAudioRecordings}
        actionsRow={<ActionsRow fieldRefs={preset?.fieldRefs} />}
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
