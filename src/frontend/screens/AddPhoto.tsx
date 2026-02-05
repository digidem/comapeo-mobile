import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {defineMessages, FormattedMessage} from 'react-intl';

import {CameraView} from '../sharedComponents/CameraView';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {useDraftObservationActions} from '../contexts/DraftObservationContext';
import {CameraCapturedPicture} from 'expo-camera';
import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';
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
  const {addPhoto} = useDraftObservationActions();

  const handleAddPress = (capture: {
    photo: CameraCapturedPicture;
    metadata: PhotoMetadata;
  }) => {
    addPhoto(capture.photo, capture.metadata);
    navigation.pop();
  };

  const handleCancelPress = () => {
    navigation.pop();
  };

  return (
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
