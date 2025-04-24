import * as React from 'react';
import {Alert, AlertButton, TouchableOpacity, View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import SaveCheck from '../../images/CheckMark.svg';
import {useTrackActions, useTrackState} from '../../contexts/TrackStoreContext';
import {useCreateDocument} from '@comapeo/core-react';
import {useAuthContext} from '../../contexts/AuthContext';
import {useCreateAttachment} from '../../hooks/server/media';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {
  isProcessedDraftPhoto,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';
import * as Sentry from '@sentry/react-native';
import {defineMessages, useIntl} from 'react-intl';
import {ObservationValueWithPreset} from '../../contexts/PersistedStores/DraftObservationStore';

const m = defineMessages({
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

export const SaveButtonCreate = () => {
  const isTracking = useTrackState(state => state.isTracking);
  const {authState} = useAuthContext();
  const {projectId} = useActiveProject();
  const value = useDraftObservationState(state => state.value);
  const {clearDraft} = useDraftObservationActions();
  const navigation = useNavigationFromRoot();
  const attachments = useDraftObservationState(
    state => state.unsavedAttachments,
  );

  const {
    addNewLocations: addNewTrackLocations,
    addNewObservation: addNewTrackObservation,
  } = useTrackActions();
  const {formatMessage} = useIntl();

  const {mutateAsync: createAttachmentAsync, status: observationStatus} =
    useCreateAttachment();
  const {mutate: createObservationMutation} = useCreateDocument({
    docType: 'observation',
    projectId,
  });

  function checkAccuracyAndLocation() {
    if (!value) throw new Error('no observation saved in persisted state ');

    if (authState === 'obscured') {
      clearDraft();
      navigation.popTo('Home', {screen: 'Map'});
      return;
    }

    const confirmationOptions: AlertButton[] = [
      {
        text: formatMessage(m.saveAnyway),
        onPress: () => createObservation(value),
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

    const accuracy = value.metadata?.position?.coords?.accuracy;
    const lat = value.lat;
    const lon = value.lon;

    if (lat === undefined || lon === undefined) {
      Alert.alert(
        formatMessage(m.noGpsTitle),
        formatMessage(m.noGpsDesc),
        confirmationOptions,
      );
      return;
    }

    if (!accuracy || accuracy >= MAXIMUM_ACCURACY) {
      Alert.alert(
        formatMessage(m.weakGpsTitle),
        formatMessage(m.weakGpsDesc),
        confirmationOptions,
      );
      return;
    }

    createObservation(value);
  }

  async function createObservation(value: ObservationValueWithPreset) {
    const photoAndAudioAttachments = !attachments
      ? []
      : Array.from(attachments.values()).filter(att => {
          return isUnsavedAudio(att) || isProcessedDraftPhoto(att);
        });

    createObservationMutation(
      {
        value: {
          ...value,
          attachments: [
            ...value.attachments,
            ...(await Promise.all(
              photoAndAudioAttachments.map(file => createAttachmentAsync(file)),
            )),
          ],
        },
      },
      {
        onSuccess: data => {
          clearDraft();
          if (isTracking) {
            if (data?.lat && data?.lon) {
              addNewTrackLocations([
                {
                  timestamp: new Date().getTime(),
                  latitude: data.lat,
                  longitude: data.lon,
                },
              ]);
            }
            addNewTrackObservation({
              docId: data.docId,
              versionId: data.versionId,
            });
          }
          navigation.popTo('Home', {screen: 'Map'});
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );

    return;
  }
  return observationStatus === 'pending' ? (
    <View style={{marginRight: 10}}>
      <UIActivityIndicator size={30} />
    </View>
  ) : (
    <TouchableOpacity
      onPress={checkAccuracyAndLocation}
      testID="OBS.edit-save-btn">
      <SaveCheck />
    </TouchableOpacity>
  );
};
