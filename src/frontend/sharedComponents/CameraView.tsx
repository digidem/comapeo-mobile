import React, {useRef} from 'react';
import {View, StyleSheet, Text, StatusBar} from 'react-native';
import {CameraCapturedPicture} from 'expo-camera';
import {Accelerometer, AccelerometerMeasurement} from 'expo-sensors';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import {AddButton} from './AddButton';
import {FormattedMessage, defineMessages} from 'react-intl';
import {Subscription} from 'expo-sensors/build/DeviceSensor';
import {useLocationState} from '../contexts/LocationContext';
import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';
// import * as Sentry from '@sentry/react-native';
// import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
// import {toError} from '../utils/errors';

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
  const accelerometerMeasurement =
    React.useRef<AccelerometerMeasurement | null>(null);
  const {hasPermission} = useCameraPermission();
  const camera = useRef<Camera>(null);
  const location = useLocationState(store => store.location);
  // const navigation = useNavigationFromRoot();
  const device = useCameraDevice('back');

  console.log({hasPermission, device});

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

  function handleAddPress() {
    if (!camera.current) {
      throw new Error('Camera Not Ready');
    }

    // if there is a double click of the button => ignore
    if (capturing) {
      return;
    }

    setCapturing(true);

    camera.current.takePhoto({enableShutterSound: false}).then(photo => {
      onAddPress({
        photo: {...photo, uri: '', format: 'jpg'},
        metadata: {
          location,
          accelerometer: accelerometerMeasurement.current || undefined,
          timestamp: Date.now(),
        },
      });
    });
  }

  // const handleAddPress = React.useCallback(() => {
  //   if (!camera.current) {
  //     throw new Error('Camera Not Ready');
  //   }

  //   // if there is a double click of the button => ignore
  //   if (capturing) {
  //     return;
  //   }

  //   setCapturing(true);

  //   camera.current
  //     .takePictureAsync({
  //       base64: false,
  //       exif: true,
  //       skipProcessing: false,
  //       shutterSound: false,
  //       quality: 0.75,
  //       imageType: 'jpg',
  //     })
  //     .then(photo => {
  //       onAddPress({
  //         photo,
  //         metadata: {
  //           location,
  //           accelerometer: accelerometerMeasurement.current || undefined,
  //           timestamp: Date.now(),
  //         },
  //       });
  //     })
  //     .catch(err => {
  //       Sentry.captureException(err);
  //       navigation.navigate('ErrorBottomSheet', {
  //         error: toError(err, 'Error taking picture'),
  //       });
  //     })
  //     .finally(() => {
  //       setCapturing(false);
  //     });
  // }, [capturing, setCapturing, onAddPress, location, navigation]);

  const disableButton = capturing; //|| !cameraReady;

  return (
    <View style={styles.container} testID="MAIN.camera-scrn">
      <StatusBar barStyle="light-content" />
      {!hasPermission || !device ? (
        <View style={styles.noPermissionContainer}>
          <Text style={{marginBottom: 10}}>
            <FormattedMessage {...m.noCameraAccess} />
          </Text>
        </View>
      ) : (
        <Camera
          device={device}
          ref={camera}
          style={{flex: 1}}
          isActive={true}
          photo={true}
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
