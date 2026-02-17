import React from 'react';
import {View, StyleSheet, Text, StatusBar} from 'react-native';
import {
  CameraCapturedPicture,
  CameraView as ExpoCameraView,
  useCameraPermissions,
} from 'expo-camera';
import {Accelerometer, AccelerometerMeasurement} from 'expo-sensors';

import {AddButton} from './AddButton';
import {FormattedMessage, defineMessages} from 'react-intl';
import {Subscription} from 'expo-sensors/build/DeviceSensor';
import {useLocationState} from '../contexts/LocationContext';
import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';
import * as Sentry from '@sentry/react-native';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';

const m = defineMessages({
  noCameraAccess: {
    id: 'screens.CameraScreen.noCameraAccess',
    defaultMessage: 'No access to camera. Please Allow access in setting',
  },
  goToSettings: {
    id: 'screens.CameraScreen.goToSettings',
    defaultMessage: 'Go to Settings',
  },
});

type Props = {
  // Called when the user takes a picture.
  onAddPress: (photo: {
    photo: CameraCapturedPicture;
    metadata: PhotoMetadata;
  }) => void;
};

export const CameraView = ({onAddPress}: Props) => {
  const [capturing, setCapturing] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const ref = React.useRef<ExpoCameraView>(null);
  const accelerometerMeasurement =
    React.useRef<AccelerometerMeasurement | null>(null);
  const [permissionsResponse] = useCameraPermissions();
  const location = useLocationState(store => store.location);
  const navigation = useNavigationFromRoot();

  React.useEffect(() => {
    let isCancelled = false;
    let deviceMotionSub: Subscription;
    (async () => {
      try {
        const motionAvailable = await Accelerometer.isAvailableAsync();
        if (!motionAvailable || isCancelled) return;
        Accelerometer.setUpdateInterval(300);
        if (isCancelled) return;
        deviceMotionSub = Accelerometer.addListener(acc => {
          accelerometerMeasurement.current = acc;
        });
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {
      isCancelled = true;
      if (deviceMotionSub) deviceMotionSub.remove();
    };
  }, []);

  const handleAddPress = React.useCallback(() => {
    if (!ref.current) {
      throw new Error('Camera Not Ready');
    }

    // if there is a double click of the button => ignore
    if (capturing) {
      return;
    }

    setCapturing(true);

    ref.current
      .takePictureAsync({
        base64: false,
        exif: true,
        skipProcessing: false,
        shutterSound: false,
        quality: 0.75,
        imageType: 'jpg',
      })
      .then(photo => {
        onAddPress({
          photo,
          metadata: {
            location,
            accelerometer: accelerometerMeasurement.current || undefined,
            timestamp: Date.now(),
          },
        });
      })
      .catch(err => {
        Sentry.captureException(err);
        navigation.navigate('ErrorBottomSheet');
      })
      .finally(() => {
        setCapturing(false);
      });
  }, [capturing, setCapturing, onAddPress, location, navigation]);

  const disableButton = capturing || !cameraReady;
  const permissionGranted = permissionsResponse?.status === 'granted';

  return (
    <View style={styles.container} testID="MAIN.camera-scrn">
      <StatusBar barStyle="light-content" />
      {!permissionGranted ? (
        <View style={styles.noPermissionContainer}>
          <Text style={{marginBottom: 10}}>
            <FormattedMessage {...m.noCameraAccess} />
          </Text>
        </View>
      ) : (
        <ExpoCameraView
          ref={ref}
          onCameraReady={() => {
            setCameraReady(true);
          }}
          style={{flex: 1}}
          facing="back"
          animateShutter={false}
        />
      )}

      <AddButton
        onPress={handleAddPress}
        disabled={disableButton}
        style={{opacity: disableButton ? 0.5 : 1}}
        testID="addButtonCamera"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  noPermissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
