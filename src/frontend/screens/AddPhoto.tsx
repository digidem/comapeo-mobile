import React from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import {defineMessages, FormattedMessage} from 'react-intl';

import {CameraView} from '../sharedComponents/CameraView';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {useDraftObservationActions} from '../contexts/DraftObservationContext';
import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import type {PhotoFile} from 'react-native-vision-camera';
import {useCustomSafeAreaInsets} from '../hooks/useCustomSafeAreaInsets';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DARK_GREY, RED} from '../lib/styles';

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
    photo: PhotoFile;
    metadata: PhotoMetadata;
  }) => {
    addPhoto(capture.photo, capture.metadata);
    navigation.pop();
  };

  const handleCancelPress = () => {
    navigation.pop();
  };

  const {bottom} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottom,
          backgroundColor: DARK_GREY,
        },
      ]}>
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
    backgroundColor: RED,
  },
  cancelButtonLabel: {
    color: 'white',
  },
});
