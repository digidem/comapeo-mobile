import * as React from 'react';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {Editor} from '../../sharedComponents/Editor';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useCreateObservation} from '../../hooks/server/observations';
import {CommonActions} from '@react-navigation/native';
import {
  useCreateBlobMutation,
  useCreateAudioBlobMutation,
} from '../../hooks/server/media';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {SaveButton} from '../../sharedComponents/SaveButton';
import {useMostAccurateLocationForObservation} from './useMostAccurateLocationForObservation';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {HeaderLeft} from './HeaderLeft';
import {ActionsRow} from '../../sharedComponents/ActionRow';
import {Alert, type AlertButton} from 'react-native';

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
  noGpsTitle: {
    id: 'screens.ObservationCreate.noGpsTitle',
    defaultMessage: 'No GPS signal',
    description: 'Title of dialog when trying to save with no GPS coords',
  },
  noGpsDesc: {
    id: 'screens.ObservationCreate.noGpsDesc',
    defaultMessage:
      'This observation does not have a location. You can continue waiting for a GPS signal, save the observation without a location, or enter coordinates manually',
    description: 'Description in dialog when trying to save with no GPS coords',
  },
  weakGpsTitle: {
    id: 'screens.ObservationCreate.weakGpsTitle',
    defaultMessage: 'Weak GPS signal',
    description: 'Title of dialog when trying to save with low GPS accuracy.',
  },
  weakGpsDesc: {
    id: 'screens.ObservationCreate.weakGpsDesc',
    defaultMessage:
      'GPS accuracy is low. You can continue waiting for better accuracy, save the observation with low accuracy, or enter coordinates manually',
    description:
      'Description in dialog when trying to save with low GPS accuracy.',
  },
  saveAnyway: {
    id: 'screens.ObservationCreate.saveAnyway',
    defaultMessage: 'Save',
    description: 'Button to save regardless of GPS state',
  },
  manualEntry: {
    id: 'screens.ObservationCreate.manualEntry',
    defaultMessage: 'Manual Coords',
    description: 'Button to manually enter GPS coordinates',
  },
  keepWaiting: {
    id: 'screens.ObservationCreate.keepWaiting',
    defaultMessage: 'Continue waiting',
    description: 'Button to cancel save and continue waiting for GPS',
  },
});

const MAXIMUM_ACCURACY = 10;

export const ObservationCreate = ({
  navigation,
}: NativeRootNavigationProps<'ObservationCreate'>) => {
  const {formatMessage} = useIntl();
  const {usePreset} = useDraftObservation();
  const preset = usePreset();
  const value = usePersistedDraftObservation(store => store.value);
  const audioRecordings = usePersistedDraftObservation(
    store => store.audioRecordings,
  );
  const {updateTags, clearDraft} = useDraftObservation();
  const photos = usePersistedDraftObservation(store => store.photos);
  const createObservationMutation = useCreateObservation();
  const createBlobMutation = useCreateBlobMutation();
  const createAudioBlobMutation = useCreateAudioBlobMutation();
  const isTracking = usePersistedTrack(state => state.isTracking);
  const addNewTrackLocations = usePersistedTrack(
    state => state.addNewLocations,
  );
  const addNewTrackObservation = usePersistedTrack(
    state => state.addNewObservation,
  );
  const liveLocation = useMostAccurateLocationForObservation();

  const coordinateInfo = value?.metadata?.manualLocation
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
    const savableAudioRecordings = audioRecordings;

    if (savablePhotos.length === 0 && savableAudioRecordings.length === 0) {
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
    const photoPromises = savablePhotos.map(photo => {
      return createBlobMutation.mutateAsync(
        // @ts-expect-error Due to TS array filtering limitations. Fixed in TS 5.5
        photo,
      );
    });

    const audioPromises = savableAudioRecordings.map(audio => {
      return createAudioBlobMutation.mutateAsync(audio);
    });

    Promise.all([...photoPromises, ...audioPromises]).then(results => {
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
              addNewTrackObservation({
                docId: data.docId,
                versionId: data.versionId,
              });
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
    createAudioBlobMutation,
    createObservationMutation,
    isTracking,
    navigation,
    photos,
    audioRecordings,
    value,
  ]);

  const checkAccuracyAndLocation = React.useCallback(() => {
    const confirmationOptions: AlertButton[] = [
      {
        text: formatMessage(m.saveAnyway),
        onPress: createObservation,
        style: 'default',
      },
      {
        text: formatMessage(m.manualEntry),
        onPress: () => navigation.navigate('ManualGpsScreen'),
        style: 'cancel',
      },
      {
        text: formatMessage(m.keepWaiting),
        onPress: () => {},
      },
    ];

    if (!value) {
      return;
    }

    // If the user has already inputted a manual location, do not check if location is accurate
    if (value.metadata?.manualLocation) {
      createObservation();
      return;
    }

    const accuracy = value.metadata?.position?.coords?.accuracy;

    if (!liveLocation) {
      Alert.alert(
        formatMessage(m.noGpsTitle),
        formatMessage(m.noGpsDesc),
        confirmationOptions,
      );
      return;
    }

    // If we don't have accuracy, allow save anyway (this is a remnant from mapeo: https://github.com/digidem/mapeo-mobile/blob/0c0ebbb9ef2261e21cd1d1c8bd5ab2fe42017ea3/src/frontend/screens/ObservationEdit/SaveButton.js#L125C3-L125C50)
    if (
      accuracy &&
      typeof accuracy === 'number' &&
      accuracy >= MAXIMUM_ACCURACY
    ) {
      Alert.alert(
        formatMessage(m.weakGpsTitle),
        formatMessage(m.weakGpsDesc),
        confirmationOptions,
      );
      return;
    }

    createObservation();
  }, [createObservation, formatMessage, navigation, liveLocation, value]);

  React.useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <SaveButton
          onPress={checkAccuracyAndLocation}
          isLoading={
            createObservationMutation.isPending ||
            createBlobMutation.isPending ||
            createAudioBlobMutation.isPending
          }
        />
      ),
    });
  }, [
    navigation,
    createBlobMutation.isPending,
    createObservationMutation.isPending,
    createAudioBlobMutation.isPending,
    checkAccuracyAndLocation,
  ]);

  return (
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
        audioRecordings={audioRecordings}
        location={coordinateInfo}
        actionsRow={<ActionsRow fieldRefs={preset?.fieldRefs} />}
      />
      <ErrorBottomSheet
        error={
          createObservationMutation.error ||
          createBlobMutation.error ||
          createAudioBlobMutation.error
        }
        clearError={() => {
          createObservationMutation.reset();
          createBlobMutation.reset();
          createAudioBlobMutation.reset();
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
