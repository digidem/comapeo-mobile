import React from 'react';
import {Alert, AlertButton, View} from 'react-native';
import debug from 'debug';
import {defineMessages, useIntl} from 'react-intl';

import {IconButton} from '../../sharedComponents/IconButton';
import {SaveIcon} from '../../sharedComponents/icons/SaveIcon';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useCreateObservation} from '../../hooks/server/observations';
import {useEditObservation} from '../../hooks/server/observations';
import {UIActivityIndicator} from 'react-native-indicators';
import {useCreateBlobMutation} from '../../hooks/server/media';
import {DraftPhoto, Photo} from '../../contexts/PhotoPromiseContext/types';

const m = defineMessages({
  noGpsTitle: {
    id: 'screens.ObservationEdit.SaveButton.noGpsTitle',
    defaultMessage: 'No GPS signal',
    description: 'Title of dialog when trying to save with no GPS coords',
  },
  noGpsDesc: {
    id: 'screens.ObservationEdit.SaveButton.noGpsDesc',
    defaultMessage:
      'This observation does not have a location. You can continue waiting for a GPS signal, save the observation without a location, or enter coordinates manually',
    description: 'Description in dialog when trying to save with no GPS coords',
  },
  weakGpsTitle: {
    id: 'screens.ObservationEdit.SaveButton.weakGpsTitle',
    defaultMessage: 'Weak GPS signal',
    description: 'Title of dialog when trying to save with low GPS accuracy.',
  },
  weakGpsDesc: {
    id: 'screens.ObservationEdit.SaveButton.weakGpsDesc',
    defaultMessage:
      'GPS accuracy is low. You can continue waiting for better accuracy, save the observation with low accuracy, or enter coordinates manually',
    description:
      'Description in dialog when trying to save with low GPS accuracy.',
  },
  saveAnyway: {
    id: 'screens.ObservationEdit.SaveButton.saveAnyway',
    defaultMessage: 'Save',
    description: 'Button to save regardless of GPS state',
  },
  manualEntry: {
    id: 'screens.ObservationEdit.SaveButton.manualEntry',
    defaultMessage: 'Manual Coords',
    description: 'Button to manually enter GPS coordinates',
  },
  keepWaiting: {
    id: 'screens.ObservationEdit.SaveButton.keepWaiting',
    defaultMessage: 'Continue waiting',
    description: 'Button to cancel save and continue waiting for GPS',
  },
});

const MINIMUM_ACCURACY = 10;
const log = debug('SaveButton');

export const SaveButton = ({
  observationId,
  openErrorModal,
}: {
  observationId?: string;
  openErrorModal?: () => void;
}) => {
  const value = usePersistedDraftObservation(store => store.value);
  const photos = usePersistedDraftObservation(store => store.photos);
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const createObservationMutation = useCreateObservation();
  const editObservationMutation = useEditObservation();
  const createBlobMutation = useCreateBlobMutation();

  function createObservation() {
    if (!value) throw new Error('no observation saved in persisted state ');

    const savablePhotos = photos.filter(isSavablePhoto);

    if (!savablePhotos) {
      createObservationMutation.mutate(
        {value},
        {
          onError: () => {
            if (openErrorModal) openErrorModal();
          },
          onSuccess: () => {
            navigation.navigate('Home', {screen: 'Map'});
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
        return createBlobMutation.mutateAsync(photo);
      }),
    )
      .then(results => {
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
            onError: () => {
              if (openErrorModal) openErrorModal();
            },
            onSuccess: () => {
              navigation.navigate('Home', {screen: 'Map'});
            },
          },
        );
      })
      .catch(() => {
        if (openErrorModal) openErrorModal();
      });
  }

  function editObservation() {
    if (!value) throw new Error('no observation saved in persisted state ');
    if (!observationId) throw new Error('Need an observation Id to edit');
    if (!('versionId' in value))
      throw new Error('Cannot update a unsaved observation (must create one)');
    // @ts-expect-error
    editObservationMutation.mutate({id: observationId, value});
    navigation.pop();
  }

  const confirmationOptions: AlertButton[] = [
    {
      text: t(m.saveAnyway),
      onPress: () => {
        createObservation();
      },
      style: 'default',
    },
    {
      text: t(m.manualEntry),
      onPress: () => {},
      style: 'cancel',
    },
    {
      text: t(m.keepWaiting),
      onPress: () => log('Cancelled save'),
    },
  ];

  const handleSavePress = () => {
    log('Draft value > ', value);
    if (!value) return;
    const isNew = !observationId;
    if (!isNew) {
      editObservation();
      return;
    }

    const hasLocation = value.lat && value.lon;
    const locationSetManually = value.metadata.manualLocation;
    if (
      locationSetManually ||
      (hasLocation && isGpsAccurate(value.metadata.position?.coords?.accuracy))
    ) {
      // Observation has a location, which is either from an accurate GPS
      // reading, or is manually entered
      createObservation();
      return;
    }
    if (!hasLocation) {
      // Observation doesn't have a location
      Alert.alert(t(m.noGpsTitle), t(m.noGpsDesc), confirmationOptions);
      return;
    }
    // Inaccurate GPS reading
    Alert.alert(t(m.weakGpsTitle), t(m.weakGpsDesc), confirmationOptions);
  };

  return createBlobMutation.isPending ||
    createObservationMutation.isPending ||
    editObservationMutation.isPending ? (
    <View style={{marginRight: 10}}>
      <UIActivityIndicator size={30} />
    </View>
  ) : (
    <IconButton onPress={handleSavePress} testID="saveButton">
      <SaveIcon inprogress={false} />
    </IconButton>
  );
};

function isGpsAccurate(accuracy?: number): boolean {
  return typeof accuracy === 'number' ? accuracy < MINIMUM_ACCURACY : true;
}

function isSavablePhoto(
  photo: Photo,
): photo is DraftPhoto & {originalUri: string} {
  if (!('draftPhotoId' in photo && !!photo.draftPhotoId)) return false;

  if (photo.deleted || photo.error) return false;

  return !!photo.originalUri;
}
