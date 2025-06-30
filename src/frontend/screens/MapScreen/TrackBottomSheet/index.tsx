import React from 'react';
import {GPSForegroundPermissionDisabled} from './GPSForegroundPermissionDisabled';
import * as Location from 'expo-location';
import {Linking, StyleSheet, View, AppState} from 'react-native';
import {GPSBackgroundPermissionDisabled} from './GPSBackgroundPermissionDisabled';
import {Loading} from '../../../sharedComponents/Loading';
import {StartStopTrack} from './StartStopTrack';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {WHITE} from '../../../lib/styles';
import {useFocusEffect} from '@react-navigation/native';

const handleOpenSettings = () => {
  Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
};

export const TrackBottomSheet = React.memo(() => {
  const [foregroundPermission, setForegroundPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);
  const [backgroundPermission, setBackgroundPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);

  const checkPermissions = React.useCallback(async () => {
    const [foreground, background] = await Promise.all([
      Location.getForegroundPermissionsAsync(),
      Location.getBackgroundPermissionsAsync(),
    ]);
    setForegroundPermission(foreground);
    setBackgroundPermission(background);
  }, []);

  // Re-check permissions on screen focus
  // Handles re-checking when navigating back from in-app
  useFocusEffect(
    React.useCallback(() => {
      checkPermissions();
    }, [checkPermissions]),
  );

  // Re-check permissions when returning from system settings
  // App goes to background during system settings, then becomes active again when user returns
  // Only needed if permissions haven't been granted yet
  React.useEffect(() => {
    if (foregroundPermission?.granted && backgroundPermission?.granted) {
      return;
    }

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkPermissions();
      }
    });

    return () => sub.remove();
  }, [
    foregroundPermission?.granted,
    backgroundPermission?.granted,
    checkPermissions,
  ]);

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
    // Semi hacky, but without this <View> the animated view bounces too far initially and then bounces back down to adjust.
    <View style={styles.container}>
      <Animated.View
        style={styles.animatedBackground}
        entering={SlideInDown.duration(250)}
        exiting={SlideOutDown.duration(250)}>
        {renderContent()}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  animatedBackground: {
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: '100%',
    minHeight: 140,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});
