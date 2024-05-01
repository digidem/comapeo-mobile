import * as React from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

import {NativeNavigationComponent} from '../../sharedTypes';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {View, ScrollView, StyleSheet} from 'react-native';
import {LocationView} from './LocationView';
import {DescriptionField} from './DescriptionField';
import {BottomSheet} from '../../sharedComponents/BottomSheet/BottomSheet';
import {ThumbnailScrollView} from '../../sharedComponents/ThumbnailScrollView';
import {PresetView} from './PresetView';
import {useBottomSheetModal} from '../../sharedComponents/BottomSheetModal';
import {ErrorModal} from '../../sharedComponents/ErrorModal';
import {SaveButton} from './SaveButton';
import {DiscardModal} from '../../sharedComponents/DiscardModal';
import {CustomHeaderLeftClose} from '../../sharedComponents/CustomHeaderLeftClose';

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
});

export const deleteObservationMessages = defineMessages({
  discardObservation: {
    id: 'screens.ObservationEdit.ObservationEditView.discardObservation',
    defaultMessage: 'Discard Observation?',
  },
  discardObservationButton: {
    id: 'screens.ObservationEdit.ObservationEditView.discardObservation',
    defaultMessage: 'Discard Observation',
  },
  discardObservationDescription: {
    id: 'screens.ObservationEdit.ObservationEditView.discardObservationDescription',
    defaultMessage:
      'Your observation will not be saved. This cannot be undone.',
  },
});

export const ObservationEdit: NativeNavigationComponent<'ObservationEdit'> & {
  editTitle: MessageDescriptor;
} = ({navigation}) => {
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );

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
      headerLeft: headerBackButtonProps => (
        <CustomHeaderLeftClose
          headerBackButtonProps={headerBackButtonProps}
          observationId={observationId}
          openDiscardModal={openSheet}
        />
      ),
    });
  }, [navigation, openSheet, observationId]);

  const handleDiscard = React.useCallback(() => {
    closeSheet();
    navigation.reset({index: 0, routes: [{name: 'Home'}]});
  }, [navigation, closeSheet]);

  const handleCameraPress = React.useCallback(() => {
    navigation.navigate('AddPhoto');
  }, [navigation]);

  // const handleDetailsPress = React.useCallback(() => {
  //   navigation.navigate('ObservationDetails', {question: 1});
  // }, [navigation]);

  const bottomSheetItems = [
    {
      icon: <></>,
      label: t(m.photoButton),
      onPress: handleCameraPress,
    },
  ];
  // if (preset && preset.fields && preset.fields.length) {
  //   // Only show the option to add details if preset fields are defined.
  //   bottomSheetItems.push({
  //     icon: <DetailsIcon />,
  //     label: t(m.detailsButton),
  //     onPress: handleDetailsPress,
  //   });
  // }

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
      <DiscardModal
        bottomSheetRef={sheetRef}
        isOpen={isOpen}
        closeSheet={closeSheet}
        title={deleteObservationMessages.discardObservation}
        description={deleteObservationMessages.discardObservationDescription}
        discardButtonText={deleteObservationMessages.discardObservationButton}
        handleDiscard={handleDiscard}
      />
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
