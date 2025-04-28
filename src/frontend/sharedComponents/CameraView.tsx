import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraView as ExpoCameraView,
  useCameraPermissions,
} from 'expo-camera';

import {AddButton} from './AddButton';
import {FormattedMessage, defineMessages} from 'react-intl';
import {useLocation} from '../hooks/useLocation';
import {PhotoMetadata} from '../contexts/PersistedStores/DraftObservationStore';

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
  // Called when the user takes a picture.
  onAddPress: (
    capturePromise: Promise<CameraCapturedPicture | undefined>,
    metadata: PhotoMetadata,
  ) => void;
};

export const CameraView = ({onAddPress}: Props) => {
  const [cameraReady, setCameraReady] = React.useState(false);
  const ref = React.useRef<ExpoCameraView>(null);
  const [permissionsResponse] = useCameraPermissions();
  const {location} = useLocation({maxDistanceInterval: 0});

  const handleAddPress = React.useCallback(() => {
    if (!ref.current) {
      throw new Error('Camera Not Ready');
    }

    const photoPromise = ref.current.takePictureAsync(captureOptions);

    onAddPress(photoPromise, {location, timestamp: Date.now()});
  }, [onAddPress, location]);

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
        disabled={!cameraReady}
        style={{opacity: !cameraReady ? 0.5 : 1}}
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
