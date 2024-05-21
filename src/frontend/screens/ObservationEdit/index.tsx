import React, {useCallback} from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {View, ScrollView, StyleSheet} from 'react-native';
import {DescriptionField} from './DescriptionField';
import {ThumbnailScrollView} from '../../sharedComponents/ThumbnailScrollView';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {SaveButton} from './SaveButton';
import {PresetAndLocationHeader} from './PresetAndLocationHeader';
import {WHITE} from '../../lib/styles';
import Photo from '../../images/redesign/Photo.svg';
import Audio from '../../images/redesign/Audio.svg';
import Details from '../../images/redesign/Details.svg';
import {ActionTab} from '../../sharedComponents/ActionTab';
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
  audioButton: {
    id: 'screens.ObservationEdit.ObservationEditView.audioButton',
    defaultMessage: 'Audio',
    description: 'Button label for adding audio',
  },
  photoButton: {
    id: 'screens.ObservationEdit.ObservationEditView.photoButton',
    defaultMessage: 'Photo',
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
  const [error, setError] = React.useState<Error | null>(null);
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );
  const {usePreset} = useDraftObservation();
  const preset = usePreset();
  const isNew = !observationId;
  const {formatMessage: t} = useIntl();

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SaveButton observationId={observationId} setError={setError} />
      ),
    });
  }, [navigation, observationId]);

  const handleCameraPress = useCallback(() => {
    navigation.navigate('AddPhoto');
  }, [navigation]);

  const handleDetailsPress = useCallback(() => {
    navigation.navigate('ObservationFields', {question: 1});
  }, [navigation]);

  const bottomSheetItems = [
    {
      icon: <Photo width={30} height={30} />,
      label: t(m.photoButton),
      onPress: handleCameraPress,
    },
  ];

  process.env.EXPO_PUBLIC_FEATURE_AUDIO &&
    bottomSheetItems.unshift({
      icon: <Audio width={30} height={30} />,
      label: t(m.audioButton),
      onPress: () => {},
    });

  if (preset?.fieldIds.length) {
    // Only show the option to add details if preset fields are defined.
    bottomSheetItems.push({
      icon: <Details width={30} height={30} />,
      label: t(m.detailsButton),
      onPress: handleDetailsPress,
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <PresetAndLocationHeader isNew={isNew} />
        <DescriptionField />
        <ThumbnailScrollView />
      </ScrollView>
      <ActionTab items={bottomSheetItems} />
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
