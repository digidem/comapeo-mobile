import {useCreateDocument} from '@comapeo/core-react';
import {Observation} from '@comapeo/schema';
import {useAuthContext} from '../../contexts/AuthContext';
import {
  useCreatePhotoAttachment,
  useCreateAudioAttachment,
} from '../../hooks/server/media';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {STORAGE_QUERY_KEY} from '../../hooks/useStorageReadingQuery';
import SaveCheck from '../../images/CheckMark.svg';
import {IconButton} from '../../sharedComponents/IconButton';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {
  Attachment,
  ClientGeneratedObservation,
  Position,
} from '../../sharedTypes';
import * as Sentry from '@sentry/react-native';
import {useTrackActions, useTrackState} from '../../contexts/TrackStoreContext';
import {Alert, AlertButton, View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {useQueryClient} from '@tanstack/react-query';
import {defineMessages, useIntl} from 'react-intl';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';
import {
  isUnsavedAudioAttachment,
  isUnsavedPhotoAttachment,
} from '../../lib/attachmentTypeChecks';

const MAXIMUM_ACCURACY = 10;

const m = defineMessages({
  noGpsTitle: {
    id: 'screens.ObservationCreate.SaveButton.noGpsTitle',
    defaultMessage: 'No GPS signal',
    description: 'Title of dialog when trying to save with no GPS coords',
  },
  noGpsDesc: {
    id: 'screens.ObservationCreate.SaveButton.noGpsDesc',
    defaultMessage:
      'This observation does not have a location. You can continue waiting for a GPS signal, save the observation without a location, or enter coordinates manually',
    description: 'Description in dialog when trying to save with no GPS coords',
  },
  weakGpsTitle: {
    id: 'screens.ObservationCreate.SaveButton.weakGpsTitle',
    defaultMessage: 'Weak GPS signal',
    description: 'Title of dialog when trying to save with low GPS accuracy.',
  },
  weakGpsDesc: {
    id: 'screens.ObservationCreate.SaveButton.weakGpsDesc',
    defaultMessage:
      'GPS accuracy is low. You can continue waiting for better accuracy, save the observation with low accuracy, or enter coordinates manually',
    description:
      'Description in dialog when trying to save with low GPS accuracy.',
  },
  saveAnyway: {
    id: 'screens.ObservationCreate.SaveButton.saveAnyway',
    defaultMessage: 'Save',
    description: 'Button to save regardless of GPS state',
  },
  manualEntry: {
    id: 'screens.ObservationCreate.SaveButton.manualEntry',
    defaultMessage: 'Manual Coords',
    description: 'Button to manually enter GPS coordinates',
  },
  keepWaiting: {
    id: 'screens.ObservationCreate.SaveButton.keepWaiting',
    defaultMessage: 'Continue waiting',
    description: 'Button to cancel save and continue waiting for GPS',
  },
});

export const ObservationCreateSaveButton = () => {
  const value = useDraftObservationState(store => store.value);
  const attachments = useDraftObservationState(
    store => store.unsavedAttachments,
  );
  const preset = useDraftObservationState(store => store.value?.presetRef);
  const {authState} = useAuthContext();
  const {clearDraft} = useDraftObservationActions();
  const navigation = useNavigationFromRoot();
  const {projectId} = useActiveProject();
  const isTracking = useTrackState(state => state.isTracking);
  const queryClient = useQueryClient();
  const {formatMessage} = useIntl();

  const {
    mutateAsync: createPhotoAttachmentAsync,
    status: photoAttachmentStatus,
  } = useCreatePhotoAttachment({projectId});

  const {
    mutateAsync: createAudioAttachmentAsync,
    status: audioAttachmentStatus,
  } = useCreateAudioAttachment({projectId});

  const {mutateAsync: createObservationAsync, status: observationStatus} =
    useCreateDocument({
      docType: 'observation',
      projectId,
    });

  const {
    addNewLocations: addNewTrackLocations,
    addNewObservation: addNewTrackObservation,
  } = useTrackActions();

  const isLoading =
    photoAttachmentStatus === 'pending' ||
    audioAttachmentStatus === 'pending' ||
    observationStatus === 'pending';

  const finalizeSave = () => {
    queryClient.invalidateQueries({queryKey: STORAGE_QUERY_KEY});
    clearDraft();
    navigation.popTo('Home', {screen: 'Map'});
  };

  const addObservationRefToTrack = (observation: Observation) => {
    if (observation.lat && observation.lon) {
      addNewTrackLocations([
        {
          timestamp: Date.now(),
          latitude: observation.lat,
          longitude: observation.lon,
        },
      ]);
    }
    addNewTrackObservation({
      docId: observation.docId,
      versionId: observation.versionId,
    });
  };

  function checkAccuracyAndLocation(
    position: Position | undefined,
  ): 'low' | 'noPosition' | 'satisfactory' {
    if (!position) {
      return 'noPosition';
    }

    const accuracy = position.coords.accuracy;

    if (!accuracy || accuracy >= MAXIMUM_ACCURACY) {
      return 'low';
    }

    return 'satisfactory';
  }

  async function saveObservation(value: ClientGeneratedObservation) {
    if (authState === 'obscured') {
      clearDraft();
      navigation.popTo('Home', {screen: 'Map'});
      return;
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

      const createdObservation = await createObservationAsync({
        value: {
          ...value,
          attachments: [...value.attachments, ...newAttachments],
          presetRef: preset
            ? {docId: preset.docId, versionId: preset.versionId}
            : undefined,
        },
      });

      if (isTracking) {
        addObservationRefToTrack(createdObservation);
      }

      finalizeSave();
    } catch (err) {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet');
    }
  }

  function handlePressSave() {
    if (!value) throw new Error('No observation saved in persisted state');

    if (value.metadata?.manualLocation) {
      saveObservation(value);
      return;
    }

    const accuracy = checkAccuracyAndLocation(value.metadata?.position);

    if (accuracy === 'satisfactory') {
      saveObservation(value);
      return;
    }

    const confirmationOptions: AlertButton[] = [
      {
        text: formatMessage(m.saveAnyway),
        onPress: () => saveObservation(value),
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

    if (accuracy === 'noPosition') {
      Alert.alert(
        formatMessage(m.noGpsTitle),
        formatMessage(m.noGpsDesc),
        confirmationOptions,
      );
      return;
    }

    if (accuracy === 'low') {
      Alert.alert(
        formatMessage(m.weakGpsTitle),
        formatMessage(m.weakGpsDesc),
        confirmationOptions,
      );
      return;
    }
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
