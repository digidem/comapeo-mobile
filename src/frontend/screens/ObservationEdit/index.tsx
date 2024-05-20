import React, {useCallback} from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {View, ScrollView, StyleSheet} from 'react-native';
import {DescriptionField} from './DescriptionField';
import {ThumbnailScrollView} from '../../sharedComponents/ThumbnailScrollView';
import {useBottomSheetModal} from '../../sharedComponents/BottomSheetModal';
import {ErrorModal} from '../../sharedComponents/ErrorModal';
import {SaveButton} from './SaveButton';
import {PresetInformation} from './PresetInformation';
import {WHITE} from '../../lib/styles';
import Photo from '../../images/Photo.svg';
import Audio from '../../images/Audio.svg';
import Details from '../../images/DetailsGroup.svg';
import ActionTab from '../../sharedComponents/ActionTab/ActionTab';
import {useDraftObservation} from '../../hooks/useDraftObservation';

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
    defaultMessage: 'Photo',
    description: 'Button label for adding photo',
  },
  audioButton: {
    id: 'screens.ObservationEdit.ObservationEditView.photoButton',
    defaultMessage: 'Audio',
    description: 'Button label for adding photo',
  },
  detailsButton: {
    id: 'screens.ObservationEdit.ObservationEditView.detailsButton',
    defaultMessage: 'Details',
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

  const handleCameraPress = useCallback(() => {
    navigation.navigate('AddPhoto');
  }, [navigation]);

  const handleDetailsPress = useCallback(() => {
    navigation.navigate('ObservationFields', {question: 1});
  }, [navigation]);

  const bottomSheetItems = [
    {
      icon: <Audio />,
      label: t(m.audioButton),
      onPress: () => {},
    },
    {
      icon: <Photo />,
      label: t(m.photoButton),
      onPress: handleCameraPress,
    },
  ];

  if (preset?.fieldIds.length) {
    // Only show the option to add details if preset fields are defined.
    bottomSheetItems.push({
      icon: <Details />,
      label: t(m.detailsButton),
      onPress: handleDetailsPress,
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        <PresetInformation isNew={isNew} />
        <DescriptionField />
        <ThumbnailScrollView />
      </ScrollView>
      <ActionTab items={bottomSheetItems} />
      <ErrorModal sheetRef={sheetRef} closeSheet={closeSheet} isOpen={isOpen} />
    </View>
  );
};

ObservationEdit.navTitle = m.newTitle;
ObservationEdit.editTitle = m.editTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
  scrollViewContent: {
    flexDirection: 'column',
    alignContent: 'stretch',
  },
});
