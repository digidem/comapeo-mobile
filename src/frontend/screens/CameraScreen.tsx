import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {CameraView} from '../sharedComponents/CameraView';
import {NativeHomeTabsNavigationProps} from '../sharedTypes/navigation';
import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';
import {useDraftObservationActions} from '../contexts/DraftObservationContext';
import type {TakenPhoto} from '../sharedComponents/CameraView';

export const CameraScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<'Camera'>) => {
  const isFocused = useIsFocused();
  const {createDraft, addPhoto} = useDraftObservationActions();

  function handleAddPress(capture: {
    photo: TakenPhoto;
    metadata: PhotoMetadata;
  }) {
    createDraft();
    addPhoto(capture.photo, capture.metadata);
    navigation.navigate('ObservationCategoryChooser');
  }

  return (
    <View style={styles.container}>
      {isFocused ? <CameraView onAddPress={handleAddPress} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
