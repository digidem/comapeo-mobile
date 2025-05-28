import {captureException} from '@sentry/react-native';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraView as ExpoCameraView,
  useCameraPermissions,
} from 'expo-camera';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Accelerometer, AccelerometerMeasurement} from 'expo-sensors';
import {parse} from 'valibot';

import {AddButton} from './AddButton';
import {FormattedMessage, defineMessages} from 'react-intl';
import {Subscription} from 'expo-sensors/build/DeviceSensor';
import {
  MediaMetadata,
  PhotoPromiseWithMetadata,
} from '../contexts/PhotoPromiseContext/types';
import {useLocation} from '../hooks/useLocation';
import {locationToEXIF, PhotoEXIFSchema} from '../lib/exif';

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

const BASE_CAMERA_CAPTURE_OPTIONS: CameraPictureOptions = {
  base64: false,
  exif: true,
  skipProcessing: true,
};

type Props = {
  // Called when the user takes a picture.
  onAddPress: (capture: PhotoPromiseWithMetadata) => void;
};

export const CameraView = ({onAddPress}: Props) => {
  const [capturing, setCapturing] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const ref = React.useRef<ExpoCameraView>(null);
  const accelerometerMeasurement = React.useRef<AccelerometerMeasurement>();
  const [permissionsResponse] = useCameraPermissions();
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

    // if there is a double click of the button => ignore
    if (capturing) {
      return;
    }

    setCapturing(true);

    const captureOptions = location
      ? {
          ...BASE_CAMERA_CAPTURE_OPTIONS,
          // Apparently not all devices will encode GPS information when taking a photo
          // so we provide it manually to ensure its presence.
          // https://github.com/expo/expo/commit/dce5905664dc4559ea1935a6c946526e4c46278c
          additionalExif: locationToEXIF(location),
        }
      : BASE_CAMERA_CAPTURE_OPTIONS;

    ref.current
      .takePictureAsync(captureOptions)
      .then(pic => {
        if (!pic) return;

        let mediaMetadata: MediaMetadata = {
          location,
          timestamp: Date.now(),
        };

        if (pic.exif) {
          try {
            const extractedExif = parse(PhotoEXIFSchema, pic.exif);

            mediaMetadata = {
              ...mediaMetadata,
              photoExif: extractedExif,
            };
          } catch (err) {
            captureException(err);
          }
        }

        onAddPress({
          capturePromise: rotatePhoto(pic, accelerometerMeasurement.current),
          mediaMetadata,
        });
      })
      .catch(err => {
        captureException(err);
        setCapturing(false);
      })
      .finally(() => {
        setCapturing(false);
      });
  }, [capturing, setCapturing, onAddPress, location]);

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
  ).then(resized => {
    return {uri: resized.uri};
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
