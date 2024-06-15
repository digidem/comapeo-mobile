import React from 'react';
import {MessageDescriptor, defineMessages} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {View, ScrollView, StyleSheet} from 'react-native';
import {DescriptionField} from '../../sharedComponents/EditScreen/DescriptionField';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {SaveButton} from './SaveButton';
import {LIGHT_GREY, WHITE} from '../../lib/styles';
import {ThumbnailAndActionTab} from './ThumbnailAndActionTab';

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
  // const isNew = !observationId;

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
        <View style={styles.presetAndLocation}></View>
        <DescriptionField />
      </ScrollView>
      <ThumbnailAndActionTab navigation={navigation} />
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
  presetAndLocation: {
    margin: 20,
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
});
