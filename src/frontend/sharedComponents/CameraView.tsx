import React, {useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import {Accelerometer, AccelerometerMeasurement} from 'expo-sensors';
import {
  Camera,
  useCameraDevice,
  type PhotoFile,
} from 'react-native-vision-camera';
import {useCameraPermission} from '../hooks/usePermissions';

import {GPSPill} from './GPSPill';
import {BodyText} from './Text/BodyText';
import {IconTitleDescription} from './IconTitleDescription';
import {AllowPermissionButton, OpenSettingsButton} from './PermissionButtons';
import {ScreenContentWithDock} from './ScreenContentWithDock';
import {FullScreenCenteredLoader} from './FullScreenCenteredLoader';
import PhotoLibraryIcon from '../images/PhotoLibrary.svg';
import {BLUE_GREY, DARK_GREY, WHITE} from '../lib/styles';
import {defineMessages, useIntl} from 'react-intl';
import {Subscription} from 'expo-sensors/build/DeviceSensor';
import {useLocationState} from '../contexts/LocationContext';
import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';
import * as Sentry from '@sentry/react-native';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {toError} from '../utils/errors';
import AddButtonSVG from '../images/AddButton.svg';

const m = defineMessages({
  cameraPermissionTitle: {
    id: '$1screens.CameraScreen.cameraPermissionTitle',
    defaultMessage: 'Document with Photos',
  },
  cameraPermissionDescription: {
    id: 'screens.CameraScreen.cameraPermissionDescription',
    defaultMessage: 'Camera required to use.',
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
  const cameraPermission = useCameraPermission();
  const {formatMessage} = useIntl();
  const camera = useRef<Camera>(null);
  const location = useLocationState(store => store.location);
  const navigation = useNavigationFromRoot();
  const device = useCameraDevice('back');

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

  if (cameraPermission.state === 'pending') {
    return <FullScreenCenteredLoader />;
  }

  if (cameraPermission.state !== 'granted') {
    return (
      <View style={styles.permissionScreen}>
        <ScreenContentWithDock
          testID="MAIN.camera-permission"
          contentContainerStyle={styles.permissionContent}
          dockContent={
            cameraPermission.state === 'blocked' ? (
              <OpenSettingsButton
                testID="MAIN.camera-settings-btn"
                onPress={cameraPermission.openSettings}
              />
            ) : (
              <AllowPermissionButton
                testID="MAIN.camera-allow-btn"
                onPress={cameraPermission.request}
              />
            )
          }>
          <IconTitleDescription
            color={WHITE}
            icon={<PhotoLibraryIcon color={BLUE_GREY} width={80} height={80} />}
            title={formatMessage(m.cameraPermissionTitle)}
            description={formatMessage(m.cameraPermissionDescription)}
          />
        </ScreenContentWithDock>
      </View>
    );
  }

  const disableButton = capturing || !cameraReady;

  let cameraContent;
  if (!device) {
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
      {/* iOS gets its status bar style from react-navigation's `statusBarStyle`, 
      which needs UIViewControllerBasedStatusBarAppearance YES in app.json. 
      And in iOS RN's <StatusBar /> errors unless that same key is NO. */}
      {Platform.OS === 'android' ? (
        <StatusBar barStyle="light-content" />
      ) : null}
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
  permissionScreen: {
    flex: 1,
    backgroundColor: DARK_GREY,
  },
  permissionContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
