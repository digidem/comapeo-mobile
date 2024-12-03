import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  Camera,
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraType,
} from 'expo-camera';
import {Accelerometer, AccelerometerMeasurement} from 'expo-sensors';

import {AddButton} from './AddButton';
import {FormattedMessage, defineMessages} from 'react-intl';
import {Subscription} from 'expo-sensors/build/DeviceSensor';
import {PhotoMetadata} from '../hooks/persistedState/usePersistedDraftObservationNew';
import {useLocation} from '../hooks/useLocation';

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

function createCameraPictureOptions(): CameraPictureOptions {
  return {
    base64: false,
    exif: true,
    skipProcessing: true,
  };
}

type Props = {
  onAddPress: (
    capturePromise: Promise<CameraCapturedPicture>,
    metadata: PhotoMetadata,
  ) => void;
};

export const CameraView = ({onAddPress}: Props) => {
  const [cameraReady, setCameraReady] = React.useState(false);
  const ref = React.useRef<Camera>(null);
  const accelerometerMeasurement = React.useRef<AccelerometerMeasurement>();
  const [permissionsResponse] = Camera.useCameraPermissions();
  const {location} = useLocation({maxDistanceInterval: 0});

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

    onAddPress(ref.current.takePictureAsync(createCameraPictureOptions()), {
      accelerometer: accelerometerMeasurement.current,
      location,
      timestamp: Date.now(),
    });
  }, [onAddPress, location]);

  const disableButton = !cameraReady;
  const permissionGranted = permissionsResponse?.status === 'granted';

  return (
    <View style={styles.container} testID="MAIN.camera-scrn">
      {!permissionGranted ? (
        <View style={styles.noPermissionContainer}>
          <Text style={{marginBottom: 10}}>
            <FormattedMessage {...m.noCameraAccess} />
          </Text>
        </View>
      ) : (
        <Camera
          ref={ref}
          onCameraReady={() => {
            setCameraReady(true);
          }}
          style={{flex: 1}}
          type={CameraType.back}
          useCamera2Api={false}
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
