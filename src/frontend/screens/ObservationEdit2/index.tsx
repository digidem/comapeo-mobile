import * as React from 'react';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {Editor} from '../../sharedComponents/Editor';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useEditObservation} from '../../hooks/server/observations';
import {useCreateBlobMutation} from '../../hooks/server/media';
import {SaveButton} from '../../sharedComponents/SaveButton';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {ActionsRow} from '../../sharedComponents/ActionRow';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {Loading} from '../../sharedComponents/Loading';
import {HeaderLeft} from './HeaderLeft';

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

export const ObservationEdit = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ObservationEdit'>) => {
  const {formatMessage} = useIntl();
  const project = useActiveProject();

  const value = usePersistedDraftObservation(store => store.value);
  const {updateTags, clearDraft, usePreset, existingObservationToDraft} =
    useDraftObservation();
  const preset = usePreset();
  const editObservationMutation = useEditObservation();
  const photos = usePersistedDraftObservation(store => store.photos);
  const createBlobMutation = useCreateBlobMutation();

  const notes = value?.tags.notes;
  const presetName = preset
    ? formatMessage({
        id: `presets.${preset.docId}.name`,
        defaultMessage: preset.name,
      })
    : formatMessage(m.observation);

  React.useLayoutEffect(() => {
    if (!value) {
      project.observation
        .getByDocId(route.params.observationId)
        .then(observation => {
          existingObservationToDraft(observation);
        });
    }
  }, [
    value,
    existingObservationToDraft,
    route.params.observationId,
    project.observation,
  ]);

  const editObservation = React.useCallback(() => {
    if (!value) {
      throw new Error('no observation saved in persisted state');
    }

    if (!('versionId' in value)) {
      throw new Error('Cannot update a unsaved observation (must create one)');
    }

    const newPhotos = photos.filter(photo => photo.type === 'processed');

    if (!newPhotos || !newPhotos.length) {
      editObservationMutation.mutate(
        {versionId: value.versionId, value},
        {
          onSuccess: () => {
            clearDraft();
            navigation.navigate('Home', {screen: 'Map'});
          },
        },
      );
      return;
    }

    Promise.all(
      newPhotos.map(photo => {
        return createBlobMutation.mutateAsync(
          // @ts-expect-error Due to TS array filtering limitations. Fixed in TS 5.5
          photo,
        );
      }),
    ).then(results => {
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
          onSuccess: data => {
            clearDraft();
            navigation.navigate('Observation', {observationId: data.docId});
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
  ]);

  React.useEffect(() => {
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
            name={preset?.name}
            testID={`OBS.${preset?.name}-icon`}
          />
        }
        onPressPreset={() =>
          navigation.navigate({
            key: 'fromObservationEdit',
            name: 'PresetChooser',
          })
        }
        notes={typeof notes !== 'string' ? '' : notes}
        updateNotes={newVal => {
          updateTags('notes', newVal);
        }}
        photos={photos}
        location={{lat: value.lat, lon: value.lon}}
        actionsRow={<ActionsRow fieldIds={preset?.fieldIds} />}
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
