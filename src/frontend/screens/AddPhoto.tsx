import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {Text} from '../sharedComponents/Text';
import debug from 'debug';
import {defineMessages, FormattedMessage} from 'react-intl';

import {CameraView} from '../sharedComponents/CameraView';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {useDraftObservationActions} from '../hooks/draftObservation';

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
  const {addPhoto} = useDraftObservationActions();

  const handleCancelPress = () => {
    log('cancelled');
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <CameraView
        onAddPress={(capturePromise, metadata) => {
          log('pressed add photo');
          addPhoto(capturePromise, metadata);
          navigation.pop();
        }}
      />
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
