import React from 'react';
import {MessageDescriptor, defineMessages} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {View, ScrollView, StyleSheet} from 'react-native';
import {DescriptionField} from './DescriptionField';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {SaveButton} from './SaveButton';
import {PresetAndLocationHeader} from './PresetAndLocationHeader';
import {WHITE} from '../../lib/styles';
import {ThumbnailAndActionTab} from './ThumbnailAndActionTab';
import {useBottomSheetModal} from '../../sharedComponents/BottomSheetModal';
import {PermissionAudio} from '../../sharedComponents/PermissionAudio';
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
});

export const ObservationEdit: NativeNavigationComponent<'ObservationEdit'> & {
  editTitle: MessageDescriptor;
} = ({navigation}) => {
  const [error, setError] = React.useState<Error | null>(null);
  const {observationId} = usePersistedDraftObservation(store => store);
  const isNew = !observationId;
  const {openSheet, sheetRef, isOpen, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SaveButton observationId={observationId} setError={setError} />
      ),
    });
  }, [navigation, observationId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <PresetAndLocationHeader isNew={isNew} />
        <DescriptionField />
      </ScrollView>
      <ThumbnailAndActionTab navigation={navigation} />
      <PermissionAudio
        closeSheet={closeSheet}
        isOpen={isOpen}
        sheetRef={sheetRef}
      />
      <ErrorBottomSheet error={error} clearError={() => setError(null)} />
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
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
});
