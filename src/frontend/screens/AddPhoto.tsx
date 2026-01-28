import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {defineMessages, FormattedMessage} from 'react-intl';

import {CameraView} from '../sharedComponents/CameraView';
import {useDraftObservation} from '../hooks/useDraftObservation';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {PhotoPromiseWithMetadata} from '../contexts/PhotoPromiseContext/types';
import {HeaderText} from '../sharedComponents/Text/HeaderText';

const m = defineMessages({
  cancel: {
    id: 'screens.AddPhoto.cancel',
    defaultMessage: 'Cancel',
  },
});

export const AddPhotoScreen = ({
  navigation,
}: NativeRootNavigationProps<'AddPhoto'>) => {
  const {addPhoto} = useDraftObservation();

  const handleAddPress = (capture: PhotoPromiseWithMetadata) => {
    addPhoto(capture);
    navigation.pop();
  };

  const handleCancelPress = () => {
    navigation.pop();
  };

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <View style={styles.container}>
        <CameraView onAddPress={handleAddPress} />
        <TouchableNativeFeedback onPress={handleCancelPress}>
          <View style={styles.cancelButton}>
            <HeaderText variant="header3" style={styles.cancelButtonLabel}>
              <FormattedMessage {...m.cancel} />
            </HeaderText>
          </View>
        </TouchableNativeFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  cancelButton: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  cancelButtonLabel: {
    color: 'white',
  },
});
