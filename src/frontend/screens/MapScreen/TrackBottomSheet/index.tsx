import React from 'react';
import {GPSForegroundPermissionDisabled} from './GPSForegroundPermissionDisabled';
import * as Location from 'expo-location';
import {
  Linking,
  StyleSheet,
  View,
  AppState,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import {GPSBackgroundPermissionDisabled} from './GPSBackgroundPermissionDisabled';
import {Loading} from '../../../sharedComponents/Loading';
import {StartStopTrack} from './StartStopTrack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {WHITE} from '../../../lib/styles';
import {useFocusEffect} from '@react-navigation/native';
import {useLocationPermissionModalMutation} from '../../../hooks/useLocationPermissionTracker';

const handleOpenSettings = () => {
  Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
};

const ANIMATION_DURATION = 250;

export const TrackBottomSheet = React.memo(({isOpen}: {isOpen: boolean}) => {
  const {height} = useWindowDimensions();
  const [foregroundPermission, setForegroundPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);
  const [backgroundPermission, setBackgroundPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);

  const requestForegroundPermission = useLocationPermissionModalMutation(
    Location.requestForegroundPermissionsAsync,
  );
  const requestBackgroundPermission = useLocationPermissionModalMutation(
    Location.requestBackgroundPermissionsAsync,
  );

  const checkPermissions = React.useCallback(async () => {
    const [foreground, background] = await Promise.all([
      Location.getForegroundPermissionsAsync(),
      Location.getBackgroundPermissionsAsync(),
    ]);
    setForegroundPermission(foreground);
    setBackgroundPermission(background);
  }, []);

  // Re-check permissions on screen focus, but only while the sheet is open.
  // Handles re-checking when navigating back from in-app
  useFocusEffect(
    React.useCallback(() => {
      if (isOpen) {
        checkPermissions();
      }
    }, [isOpen, checkPermissions]),
  );
  // Re-check permissions when returning from system settings
  // App goes to background during system settings, then becomes active again when user returns
  // Only needed if the sheet is open and permissions haven't been granted yet
  React.useEffect(() => {
    if (
      !isOpen ||
      (foregroundPermission?.granted && backgroundPermission?.granted)
    ) {
      return;
    }

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkPermissions();
      }
    });

    return () => sub.remove();
  }, [
    isOpen,
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
                await requestForegroundPermission.mutateAsync();
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
                await requestBackgroundPermission.mutateAsync();
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

  const isE2E = process.env.EXPO_PUBLIC_E2E_TEST === 'true';

  const measuredHeight = React.useRef(height);
  // translateY moves the object down and the sheet is pinned to the bottom of the screen
  // By setting the initial value to the height of the screen, it will be moved completely off the screen
  // This means that it is NOT shown at first, which is desired
  const translateY = useSharedValue(height);

  React.useEffect(() => {
    translateY.value = withTiming(isOpen ? 0 : measuredHeight.current, {
      duration: ANIMATION_DURATION,
    });
  }, [isOpen, translateY]);

  const onLayoutSheet = (event: LayoutChangeEvent) => {
    measuredHeight.current = event.nativeEvent.layout.height;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  if (isE2E) {
    if (!isOpen) {
      return null;
    }
    return (
      <View style={styles.container}>
        <View style={styles.animatedBackground}>{renderContent()}</View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.animatedBackground, animatedStyle]}
      onLayout={onLayoutSheet}
      pointerEvents={isOpen ? 'auto' : 'none'}>
      {renderContent()}
    </Animated.View>
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
    position: 'absolute',
    bottom: 0,
  },
});
