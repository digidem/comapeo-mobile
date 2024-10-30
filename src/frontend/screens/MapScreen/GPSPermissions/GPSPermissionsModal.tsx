import React, {useEffect, useState} from 'react';
import {GPSForegroundPermissionDisabled} from './GPSForegroundPermissionDisabled';
import {GPSPermissionsEnabled} from './GPSPermissionsEnabled';
import * as Location from 'expo-location';
import {useGPSModalContext} from '../../../contexts/GPSModalContext';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {TAB_BAR_HEIGHT} from '../../../Navigation/Stack/AppScreens';
import {StyleSheet} from 'react-native';
import {GPSBackgroundPermissionDisabled} from './GPSBackgroundPermissionDisabled';

export const GPSPermissionsModal = React.memo(() => {
  const {setCurrentTab} = useTabNavigationStore();
  const [backgroundStatus] = Location.useBackgroundPermissions();
  const [foregroundStatus] = Location.useForegroundPermissions();

  const [foregroundStatusGranted, setForegroundStatusGranted] = useState<
    boolean | null
  >(null);
  const [backgroundStatusGranted, setBackgroundStatusGranted] = useState<
    boolean | null
  >(null);
  const {bottomSheetRef} = useGPSModalContext();

  useEffect(() => {
    if (foregroundStatus && foregroundStatusGranted === null) {
      setForegroundStatusGranted(foregroundStatus.granted);
    }
  }, [foregroundStatus, foregroundStatusGranted]);

  useEffect(() => {
    if (backgroundStatus && backgroundStatusGranted === null) {
      setBackgroundStatusGranted(backgroundStatus.granted);
    }
  }, [backgroundStatus, backgroundStatusGranted]);

  const onBottomSheetDismiss = () => {
    setCurrentTab('Map');
  };

  return (
    <BottomSheetModal
      bottomInset={TAB_BAR_HEIGHT}
      style={styles.modal}
      ref={bottomSheetRef}
      enableDynamicSizing
      onDismiss={onBottomSheetDismiss}
      handleComponent={() => null}>
      <BottomSheetView>
        {!foregroundStatusGranted ? (
          <GPSForegroundPermissionDisabled
            setForegroundStatusGranted={setForegroundStatusGranted}
          />
        ) : !backgroundStatusGranted ? (
          <GPSBackgroundPermissionDisabled
            setBackgroundStatusGranted={setBackgroundStatusGranted}
          />
        ) : (
          <GPSPermissionsEnabled />
        )}
      </BottomSheetView>
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
