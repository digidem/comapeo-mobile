import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {
  Camera,
  CameraPictureOptions,
  CameraType,
  CameraCapturedPicture,
} from 'expo-camera';

import {AddButton} from './AddButton';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
import {useResetPermissions} from '../hooks/useResetPermissions';
import {Loading} from './Loading';
import {WHITE} from '../lib/styles';

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

const captureOptions: CameraPictureOptions = {
  base64: false,
  exif: true,
  skipProcessing: true,
};

type Props = {
  // Called when the user takes a picture, with a promise that resolves to an
  // object with the property `uri` for the captured (and rotated) photo.
  onAddPress: (capture: Promise<CameraCapturedPicture>) => void;
};

export const CameraView = ({onAddPress}: Props) => {
  const [capturing, setCapturing] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const [status, requestPermission] = Camera.useCameraPermissions();
  const ref = React.useRef<Camera>(null);
  const {navigateToSettings} = useResetPermissions(
    'android.permission.CAMERA',
    requestPermission,
  );
  const {formatMessage: t} = useIntl();

  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleAddPress = React.useCallback(() => {
    if (!ref.current) {
      throw new Error('Camera Not Ready');
    }

    // if there is a double click of the button => ignore
    if (capturing) {
      return;
    }

    setCapturing(true);

    const capturedPromise = ref.current
      .takePictureAsync(captureOptions)
      .then(pic => {
        setCapturing(false);
        return pic;
      });

    onAddPress(capturedPromise);

    return () => {
      setCapturing(false);
    };
  }, [capturing, setCapturing, onAddPress]);

  const disableButton = capturing || !cameraReady;

  return (
    <View style={styles.container}>
      {!status ? (
        <Loading color={WHITE} />
      ) : !status.granted ? (
        <View style={styles.noPermissionContainer}>
          <Text style={{marginBottom: 10}}>
            <FormattedMessage {...m.noCameraAccess} />
          </Text>
          <Button
            onPress={() => navigateToSettings()}
            title={t(m.goToSettings)}
          />
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
