import React from 'react';
import {GPSForegroundPermissionDisabled} from './GPSForegroundPermissionDisabled';
import * as Location from 'expo-location';
import {Linking, StyleSheet, View} from 'react-native';
import {GPSBackgroundPermissionDisabled} from './GPSBackgroundPermissionDisabled';
import {Loading} from '../../../sharedComponents/Loading';
import {StartStopTrack} from './StartStopTrack';
import Animated from 'react-native-reanimated';

const handleOpenSettings = () => {
  Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
};

export const TrackBottomSheet = React.memo(() => {
  const [foregroundPermission, setForegroundPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);
  const [backgroundPermission, setBackgroundPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);

  React.useEffect(() => {
    Location.getForegroundPermissionsAsync().then(permission =>
      setForegroundPermission(permission),
    );

    Location.getBackgroundPermissionsAsync().then(permission =>
      setBackgroundPermission(permission),
    );
  }, []);

  const renderContent = () => {
    if (!foregroundPermission || !backgroundPermission) {
      return (
        <View style={{display: 'flex', minHeight: 200}}>
          <Loading />
        </View>
      );
    }
    if (!foregroundPermission.granted) {
      return (
        <GPSForegroundPermissionDisabled
          askForegroundLocationPermission={async () => {
            if (foregroundPermission.canAskAgain) {
              const permission =
                await Location.requestForegroundPermissionsAsync();
              setForegroundPermission(permission);
            } else {
              handleOpenSettings();
            }
          }}
        />
      );
    }
    if (!backgroundPermission.granted) {
      return (
        <GPSBackgroundPermissionDisabled
          askBackgroundLocationPermission={async () => {
            if (backgroundPermission.canAskAgain) {
              const permission =
                await Location.requestBackgroundPermissionsAsync();
              setBackgroundPermission(permission);
            } else {
              handleOpenSettings();
            }
          }}
        />
      );
    }
    return <StartStopTrack />;
  };

  return (
    <View style={styles.container}>
      <Animated.View>{renderContent()}</Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
