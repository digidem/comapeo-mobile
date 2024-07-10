import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  Camera,
  CameraPictureOptions,
  CameraType,
  CameraCapturedPicture,
} from 'expo-camera';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Accelerometer, AccelerometerMeasurement} from 'expo-sensors';

import {AddButton} from './AddButton';
import {FormattedMessage, defineMessages} from 'react-intl';
import {Subscription} from 'expo-sensors/build/DeviceSensor';
import {CapturedPictureMM} from '../contexts/PhotoPromiseContext/types';

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

const CAPTURE_QUALITY = 75;

const captureOptions: CameraPictureOptions = {
  base64: false,
  exif: true,
  skipProcessing: true,
};

type Props = {
  // Called when the user takes a picture.
  onAddPress: (capture: Promise<CapturedPictureMM>) => void;
};

export const CameraView = ({onAddPress}: Props) => {
  const [capturing, setCapturing] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const ref = React.useRef<Camera>(null);
  const accelerometerMeasurement = React.useRef<AccelerometerMeasurement>();
  const [permissionsResponse] = Camera.useCameraPermissions();

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
      .takePictureAsync(captureOptions)
      .then(pic => {
        onAddPress(rotatePhoto(pic, accelerometerMeasurement.current));
      })
      .catch(err => {
        console.log(err);
        setCapturing(false);
      })
      .finally(() => {
        setCapturing(false);
      });
  }, [capturing, setCapturing, onAddPress]);

  const disableButton = capturing || !cameraReady;
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

function rotatePhoto(
  {uri, width, height}: CameraCapturedPicture,
  acc?: AccelerometerMeasurement,
) {
  const resizePromise = ImageResizer.createResizedImage(
    uri,
    width,
    height,
    'JPEG',
    CAPTURE_QUALITY,
    getPhotoRotation(acc),
  ).then(({uri}) => {
    return {uri};
  });

  return resizePromise;
}

const ACC_AT_45_DEG = Math.sin(Math.PI / 4);

function getPhotoRotation(acc?: AccelerometerMeasurement) {
  if (!acc) return 0;
  const {x, y, z} = acc;
  let rotation = 0;
  if (z < -ACC_AT_45_DEG || z > ACC_AT_45_DEG) {
    // camera is pointing up or down
    if (Math.abs(y) > Math.abs(x)) {
      // camera is vertical
      if (y <= 0) rotation = 180;
      else rotation = 0;
    } else {
      // camera is horizontal
      if (x >= 0) rotation = -90;
      else rotation = 90;
    }
  } else if (x > -ACC_AT_45_DEG && x < ACC_AT_45_DEG) {
    // camera is vertical
    if (y <= 0) rotation = 180;
    else rotation = 0;
  } else {
    // camera is horizontal
    if (x >= 0) rotation = -90;
    else rotation = 90;
  }
  return rotation;
}

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
