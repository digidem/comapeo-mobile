import React from 'react';
import {GPSForegroundPermissionDisabled} from './GPSForegroundPermissionDisabled';
import {GPSPermissionsEnabled} from './GPSPermissionsEnabled';
import * as Location from 'expo-location';
import {useGPSModalContext} from '../../../contexts/GPSModalContext';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {TAB_BAR_HEIGHT} from '../../../Navigation/Stack/AppScreens';
import {StyleSheet, Linking, View} from 'react-native';
import {GPSBackgroundPermissionDisabled} from './GPSBackgroundPermissionDisabled';
import {Loading} from '../../../sharedComponents/Loading';

const handleOpenSettings = () => {
  Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
};

export const GPSPermissionsModal = React.memo(() => {
  const {setCurrentTab} = useTabNavigationStore();

  const [foregroundPermission, setForegroundPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);
  const [backgroundPermission, setBackgroundPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);
  const {bottomSheetRef} = useGPSModalContext();

  React.useEffect(() => {
    Location.getForegroundPermissionsAsync().then(permission =>
      setForegroundPermission(permission),
    );

    Location.getBackgroundPermissionsAsync().then(permission =>
      setBackgroundPermission(permission),
    );
  }, []);

  const onBottomSheetDismiss = () => {
    setCurrentTab('Map');
  };

  async function askForegroundLocationPermission() {
    if (foregroundPermission!.canAskAgain) {
      const permission = await Location.requestForegroundPermissionsAsync();
      setForegroundPermission(permission);
    } else {
      handleOpenSettings();
    }
  }

  async function askBackgroundLocationPermission() {
    if (backgroundPermission!.canAskAgain) {
      const permission = await Location.requestBackgroundPermissionsAsync();
      setBackgroundPermission(permission);
    } else {
      handleOpenSettings();
    }
  }

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
          askForegroundLocationPermission={askForegroundLocationPermission}
        />
      );
    }
    if (!backgroundPermission.granted) {
      return (
        <GPSBackgroundPermissionDisabled
          askBackgroundLocationPermission={askBackgroundLocationPermission}
        />
      );
    }
    return <GPSPermissionsEnabled />;
  };

  return (
    <BottomSheetModal
      bottomInset={TAB_BAR_HEIGHT}
      style={styles.modal}
      ref={bottomSheetRef}
      enableDynamicSizing
      onDismiss={onBottomSheetDismiss}
      handleComponent={() => null}>
      <BottomSheetView>{renderContent()}</BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  modal: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 140,
  },
});
