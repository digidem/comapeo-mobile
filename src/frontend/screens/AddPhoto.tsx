import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {Text} from '../sharedComponents/Text';
import debug from 'debug';
import {defineMessages, FormattedMessage} from 'react-intl';

import {CameraView} from '../sharedComponents/CameraView';
import {useDraftObservation} from '../hooks/useDraftObservation';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {CapturedPictureMM} from '../contexts/PhotoPromiseContext/types';

const m = defineMessages({
  cancel: {
    id: 'screens.AddPhoto.cancel',
    defaultMessage: 'Cancel',
  },
});

const log = debug('AddPhotoScreen');

export const AddPhotoScreen = ({
  navigation,
}: NativeRootNavigationProps<'AddPhoto'>) => {
  const {addPhoto} = useDraftObservation();

  const handleAddPress = (capture: Promise<CapturedPictureMM>) => {
    log('pressed add button');
    addPhoto(capture);
    navigation.pop();
  };

  const handleCancelPress = () => {
    log('cancelled');
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <CameraView onAddPress={handleAddPress} />
      <TouchableNativeFeedback onPress={handleCancelPress}>
        <View style={styles.cancelButton}>
          <Text style={styles.cancelButtonLabel}>
            <FormattedMessage {...m.cancel} />
          </Text>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});
