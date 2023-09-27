import React from 'react';
import {Alert, AlertButton} from 'react-native';
import debug from 'debug';
import {defineMessages, useIntl} from 'react-intl';

import {IconButton} from '../../sharedComponents/IconButton';
import {SaveIcon} from '../../sharedComponents/icons/SaveIcon';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {useCreateObservation} from '../../hooks/server/useCreateObservation';
import {Observation} from '@mapeo/schema';

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

const SaveButton = ({observationId}: {observationId?: string}) => {
  const value = usePersistedDraftObservation(store => store.value);
  const {clearDraft} = useDraftObservation();
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const createObservationCall = useCreateObservation();

  function createObservation() {
    if (!value) throw new Error('no observation saved in persisted state ');
    createObservationCall(value);
    navigation.navigate('Home', {screen: 'Map'});
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
      onPress: () => {
        clearDraft();
        navigation.navigate('ManualGpsScreen');
      },
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
    if (!isNew) return; // update observation here

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

  // useEffect(() => {
  //   if (savingStatus !== 'success') return;
  //   if (typeof observationId === 'string') {
  //     navigation.pop();
  //   } else {
  //     navigation.navigate('Home', {screen: 'Map'});
  //   }
  // }, [savingStatus, navigation, observationId]);

  return (
    <IconButton onPress={handleSavePress} testID="saveButton">
      <SaveIcon inprogress={false} />
    </IconButton>
  );
};

export default SaveButton;

// function isGpsAccurate(value: ObservationValue): boolean {
//   // TODO: metadata changed in new mapeo-schema
//   const accuracy =
//     value &&
//     value.metadata &&
//     value.metadata.location &&
//     value.metadata.location.position &&
//     value.metadata.location.position.coords.accuracy;

//   // If we don't have accuracy, allow save anyway
//   return typeof accuracy === 'number' ? accuracy < MINIMUM_ACCURACY : true;
// }

function isGpsAccurate(accuracy?: number): boolean {
  return typeof accuracy === 'number' ? accuracy < MINIMUM_ACCURACY : true;
}
