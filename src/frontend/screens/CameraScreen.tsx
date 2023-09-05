import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {CameraView} from '../sharedComponents/CameraView';
import {NativeHomeTabsNavigationProps} from '../sharedTypes';

export const CameraScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<'Camera'>) => {
  const isFocused = useIsFocused();

  function handleAddPress(photoPromise: Promise<{uri: string}>) {
    photoPromise.then(photo => {
      navigation.navigate('PhotoView', {uri: photo.uri});
    });
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
