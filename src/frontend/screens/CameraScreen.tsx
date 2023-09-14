import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {CameraView} from '../sharedComponents/CameraView';
import {NativeHomeTabsNavigationProps} from '../sharedTypes';
import {CapturedPictureMM} from '../contexts/PhotoPromiseContext/types';
import {useDraftObservation} from '../hooks/useDraftObservation';
import {usePersistedDraftObservation} from '../hooks/persistedState/usePersistedDraftObservation';

export const CameraScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<'Camera'>) => {
  const isFocused = useIsFocused();
  const {addPhoto} = useDraftObservation();
  const photos = usePersistedDraftObservation(store => store.photos);

  function handleAddPress(photoPromise: Promise<CapturedPictureMM>) {
    addPhoto(photoPromise);
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
