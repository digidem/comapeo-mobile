import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {CameraView} from '../sharedComponents/CameraView';
import {NativeHomeTabsNavigationProps} from '../sharedTypes';
import {CapturedPictureMM} from '../contexts/PhotoPromiseContext/types';
import {useDraftObservation} from '../hooks/useDraftObservation';

export const CameraScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<'Camera'>) => {
  const isFocused = useIsFocused();
  const {newDraft} = useDraftObservation();

  function handleAddPress(photoPromise: Promise<CapturedPictureMM>) {
    newDraft(photoPromise);
    navigation.navigate('PresetChooser');
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
