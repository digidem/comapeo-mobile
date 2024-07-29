import * as React from 'react';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {Editor} from '../../sharedComponents/Editor';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useCreateObservation} from '../../hooks/server/observations';
import {CommonActions} from '@react-navigation/native';
import {useCreateBlobMutation} from '../../hooks/server/media';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {SaveButton} from '../../sharedComponents/SaveButton';
import {useMostAccurateLocationForObservation} from './useMostAccurateLocationForObservation';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {HeaderLeft} from './HeaderLeft';
import {ActionsRow} from '../../sharedComponents/ActionRow';

const m = defineMessages({
  observation: {
    id: 'screens.ObservationCreate.observation',
    defaultMessage: 'Observation',
    description: 'Default name of observation with no matching preset',
  },
  navTitle: {
    id: 'screens.ObservationCreate.navTitle',
    defaultMessage: 'New Observation',
    description: 'screen title for new observation screen',
  },
  changePreset: {
    id: 'screens.ObservationCreate.changePreset',
    defaultMessage: 'Change',
  },
  descriptionPlaceholder: {
    id: 'screens.ObservationCreate.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

export const ObservationCreate = ({
  navigation,
}: NativeRootNavigationProps<'ObservationCreate'>) => {
  const {formatMessage} = useIntl();
  const {usePreset} = useDraftObservation();
  const preset = usePreset();
  const value = usePersistedDraftObservation(store => store.value);
  const {updateTags, clearDraft} = useDraftObservation();
  const photos = usePersistedDraftObservation(store => store.photos);
  const createObservationMutation = useCreateObservation();
  const createBlobMutation = useCreateBlobMutation();
  const isTracking = usePersistedTrack(state => state.isTracking);
  const addNewTrackLocations = usePersistedTrack(
    state => state.addNewLocations,
  );
  const addNewTrackObservation = usePersistedTrack(
    state => state.addNewObservation,
  );
  const liveLocation = useMostAccurateLocationForObservation();

  const coordinateInfo = value?.metadata.manualLocation
    ? {
        lat: value.lat,
        lon: value.lon,
        accuracy: liveLocation?.coords?.accuracy,
      }
    : {
        lat: liveLocation?.coords?.latitude,
        lon: liveLocation?.coords?.longitude,
        accuracy: liveLocation?.coords?.accuracy,
      };

  const notes = value?.tags.notes;
  const presetName = preset
    ? formatMessage({
        id: `presets.${preset.docId}.name`,
        defaultMessage: preset.name,
      })
    : formatMessage(m.observation);

  const createObservation = React.useCallback(() => {
    if (!value) throw new Error('no observation saved in persisted state ');

    const savablePhotos = photos.filter(photo => photo.type === 'processed');

    if (!savablePhotos) {
      createObservationMutation.mutate(
        {value},
        {
          onSuccess: () => {
            clearDraft();
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {name: 'Home', params: {screen: 'Map'}},
                  {name: 'Home', params: {screen: 'ObservationsList'}},
                ],
              }),
            );
          },
        },
      );

      return;
    }

    // Currently, we abort the process of saving an observation if saving any number of photos fails to save,
    // but this approach is prone to creating "orphaned" blobs.
    // The alternative is to save the observation but excluding photos that failed to save, which is prone to an odd UX of an observation "missing" some attachments.
    // This could potentially be alleviated by a more granular and informative UI about the photo-saving state, but currently there is nothing in place.
    // Basically, which is worse: orphaned attachments or saving observations that seem to be missing attachments?
    Promise.all(
      savablePhotos.map(photo => {
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

      createObservationMutation.mutate(
        {
          value: {
            ...value,
            attachments: [...value.attachments, ...newAttachments],
          },
        },
        {
          onSuccess: data => {
            clearDraft();
            navigation.navigate('Home', {screen: 'Map'});
            if (isTracking) {
              if (value.lat && value.lon) {
                addNewTrackLocations([
                  {
                    timestamp: new Date().getTime(),
                    latitude: value.lat,
                    longitude: value.lon,
                  },
                ]);
              }
              addNewTrackObservation(data.docId);
            }
          },
        },
      );
    });
  }, [
    addNewTrackLocations,
    addNewTrackObservation,
    clearDraft,
    createBlobMutation,
    createObservationMutation,
    isTracking,
    navigation,
    photos,
    value,
  ]);

  React.useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <SaveButton
          onPress={createObservation}
          isLoading={
            createObservationMutation.isPending || createBlobMutation.isPending
          }
        />
      ),
    });
  }, [
    navigation,
    createBlobMutation.isPending,
    createObservationMutation.isPending,
    createObservation,
  ]);

  return (
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
        location={coordinateInfo}
        actionsRow={<ActionsRow fieldIds={preset?.fieldIds} />}
      />
      <ErrorBottomSheet
        error={createObservationMutation.error || createBlobMutation.error}
        clearError={() => {
          createObservationMutation.reset();
          createBlobMutation.reset();
        }}
        tryAgain={createObservation}
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
