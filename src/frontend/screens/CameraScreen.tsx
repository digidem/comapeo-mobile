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
  const {addPhoto, clearDraft} = useDraftObservation();
  const photos = usePersistedDraftObservation(store => store.photos);

  function handleAddPress(photoPromise: Promise<CapturedPictureMM>) {
    // temporarily here. for the sake of testing we want to just access the first photo. clearing draft before taking a photo means the first photo in the array will be the photot that is about to be taken
    clearDraft();
    addPhoto(photoPromise);
    navigation.navigate('PhotoView');
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
