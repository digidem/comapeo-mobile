import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {CameraView} from '../sharedComponents/CameraView';
import {NativeHomeTabsNavigationProps} from '../sharedTypes/navigation';
import {useDraftObservationActions} from '../hooks/draftObservation';

export const CameraScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<'Camera'>) => {
  const isFocused = useIsFocused();
  const {createDraft, addPhoto} = useDraftObservationActions();

  return (
    <View style={styles.container}>
      {isFocused ? (
        <CameraView
          onAddPress={(capturePromise, metadata) => {
            createDraft();
            addPhoto(capturePromise, metadata);
            navigation.navigate('PresetChooser');
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
