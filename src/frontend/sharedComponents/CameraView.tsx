import React, {useRef} from 'react';
import {StyleSheet, TouchableOpacity, View, StatusBar} from 'react-native';
import {Accelerometer, AccelerometerMeasurement} from 'expo-sensors';
import {
  Camera,
  useCameraDevice,
  type PhotoFile,
} from 'react-native-vision-camera';
import {
  useCameraPermissionMutation,
  useRequestCameraPermissionOnMount,
} from '../hooks/useCameraPermissionTracker';
import {openSettingsAndWait} from '../utils/linking';

import {GPSPill} from './GPSPill';
import {PrimaryButton} from './Buttons';
import {BodyText} from './Text/BodyText';
import {defineMessages, useIntl} from 'react-intl';
import {Subscription} from 'expo-sensors/build/DeviceSensor';
import {useLocationState} from '../contexts/LocationContext';
import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';
import * as Sentry from '@sentry/react-native';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {toError} from '../utils/errors';
import AddButtonSVG from '../images/AddButton.svg';

const m = defineMessages({
  noCameraAccess: {
    id: '$1screens.CameraScreen.noCameraAccess',
    defaultMessage: 'No access to camera. Please allow access in settings.',
  },
  openSettings: {
    id: '$1screens.CameraScreen.openSettings',
    defaultMessage: 'Open Settings',
  },
  cameraUnavailable: {
    id: '$1screens.CameraScreen.cameraUnavailable',
    defaultMessage:
      'Camera unavailable. Please close and reopen CoMapeo to try again.',
  },
});

type Props = {
  // Called when the user takes a picture.
  onAddPress: (photo: {photo: PhotoFile; metadata: PhotoMetadata}) => void;
};

export const CameraView = ({onAddPress}: Props) => {
  const [capturing, setCapturing] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const accelerometerMeasurement =
    React.useRef<AccelerometerMeasurement | null>(null);
  const {hasPermission} = useRequestCameraPermissionOnMount();
  const {formatMessage} = useIntl();
  const camera = useRef<Camera>(null);
  const location = useLocationState(store => store.location);
  const navigation = useNavigationFromRoot();
  const device = useCameraDevice('back');
  const openSettingsMutation = useCameraPermissionMutation(openSettingsAndWait);

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
    if (!camera.current || !cameraReady) {
      throw new Error('Camera Not Ready');
    }

    // if there is a double click of the button => ignore
    if (capturing) {
      return;
    }

    setCapturing(true);

    camera.current
      .takePhoto({enableShutterSound: false})
      .then(async photo => {
        onAddPress({
          photo,
          metadata: {
            location,
            accelerometer: accelerometerMeasurement.current || undefined,
            timestamp: Date.now(),
          },
        });
        setCapturing(false);
      })
      .catch(err => {
        Sentry.captureException(err);
        navigation.navigate('ErrorBottomSheet', {
          error: toError(err, 'Error taking picture'),
        });
        setCapturing(false);
      });
  }

  const disableButton = capturing || !cameraReady || !hasPermission;

  let cameraContent;
  if (!hasPermission) {
    cameraContent = (
      <View style={styles.messageContainer}>
        <BodyText variant="tinyMeta" style={styles.messageText}>
          {formatMessage(m.noCameraAccess)}
        </BodyText>
        <PrimaryButton
          fullSize
          text={formatMessage(m.openSettings)}
          onPress={() => openSettingsMutation.mutateAsync()}
        />
      </View>
    );
  } else if (!device) {
    cameraContent = (
      <View style={styles.messageContainer}>
        <BodyText variant="tinyMeta" style={styles.messageText}>
          {formatMessage(m.cameraUnavailable)}
        </BodyText>
      </View>
    );
  } else {
    cameraContent = (
      <Camera
        device={device}
        ref={camera}
        style={{flex: 1}}
        isActive={true}
        photo={true}
        enableZoomGesture={true}
        onInitialized={() => setCameraReady(true)}
      />
    );
  }

  return (
    <View style={styles.container} testID="MAIN.camera-scrn">
      <StatusBar barStyle="light-content" />
      {cameraContent}

      <View style={styles.bottomBar}>
        <View style={styles.gpsPillContainer}>
          <GPSPill onPress={() => navigation.navigate('GpsModal')} />
        </View>
        <View
          testID="addButtonCamera"
          accessibilityLabel="Add Observation"
          style={{opacity: disableButton ? 0.5 : 1}}>
          <TouchableOpacity disabled={disableButton} onPress={handleAddPress}>
            <AddButtonSVG />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingHorizontal: 40,
  },
  messageText: {
    color: 'white',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsPillContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
