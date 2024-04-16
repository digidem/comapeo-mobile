import * as React from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

import {NativeNavigationComponent} from '../../sharedTypes';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {View, ScrollView, StyleSheet} from 'react-native';
import {LocationView} from './LocationView';
import {DescriptionField} from './DescriptionField';
import {BottomSheet} from './BottomSheet';
import {ThumbnailScrollView} from '../../sharedComponents/ThumbnailScrollView';
import {PresetView} from './PresetView';
import {useBottomSheetModal} from '../../sharedComponents/BottomSheetModal';
import {ErrorModal} from '../../sharedComponents/ErrorModal';
import {SaveButton} from './SaveButton';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {DetailsIcon} from '../../sharedComponents/icons';

const m = defineMessages({
  editTitle: {
    id: 'screens.ObservationEdit.editTitle',
    defaultMessage: 'Edit Observation',
    description: 'screen title for edit observation screen',
  },
  newTitle: {
    id: 'screens.ObservationEdit.newTitle',
    defaultMessage: 'New Observation',
    description: 'screen title for new observation screen',
  },
  photoButton: {
    id: 'screens.ObservationEdit.ObservationEditView.photoButton',
    defaultMessage: 'Add Photo',
    description: 'Button label for adding photo',
  },
  detailsButton: {
    id: 'screens.ObservationEdit.ObservationEditView.detailsButton',
    defaultMessage: 'Add Details',
    description: 'Button label to add details',
  },
});

export const ObservationEdit: NativeNavigationComponent<'ObservationEdit'> & {
  editTitle: MessageDescriptor;
} = ({navigation}) => {
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );
  const {usePreset} = useDraftObservation();
  const preset = usePreset();
  const isNew = !observationId;
  const {formatMessage: t} = useIntl();
  const {openSheet, sheetRef, isOpen, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SaveButton observationId={observationId} openErrorModal={openSheet} />
      ),
    });
  }, [navigation, openSheet, observationId]);

  const handleCameraPress = React.useCallback(() => {
    navigation.navigate('AddPhoto');
  }, [navigation]);

  const handleDetailsPress = React.useCallback(() => {
    navigation.navigate('ObservationFields', {question: 1});
  }, [navigation]);

  const bottomSheetItems = [
    {
      icon: <></>,
      label: t(m.photoButton),
      onPress: handleCameraPress,
    },
  ];
  if (preset && preset.fieldIds.length) {
    // Only show the option to add details if preset fields are defined.
    bottomSheetItems.push({
      icon: <DetailsIcon />,
      label: t(m.detailsButton),
      onPress: handleDetailsPress,
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        {isNew && <LocationView />}
        <PresetView />
        <DescriptionField />
        <ThumbnailScrollView />
      </ScrollView>
      <BottomSheet items={bottomSheetItems} />
      <ErrorModal sheetRef={sheetRef} closeSheet={closeSheet} isOpen={isOpen} />
    </View>
  );
};

ObservationEdit.navTitle = m.newTitle;
ObservationEdit.editTitle = m.editTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
  scrollViewContent: {
    flexDirection: 'column',
    alignContent: 'stretch',
  },
});
