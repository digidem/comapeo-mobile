import React, {useEffect, useState} from 'react';
import {GPSPermissionsDisabled} from './GPSPermissionsDisabled';
import {GPSPermissionsEnabled} from './GPSPermissionsEnabled';
import * as Location from 'expo-location';
import {useGPSModalContext} from '../../../contexts/GPSModalContext';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore.ts';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {TAB_BAR_HEIGHT} from '../../../Navigation/Stack/AppScreens.tsx';
import {StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

export const GPSPermissionsModal = React.memo(() => {
  const {setCurrentTab} = useTabNavigationStore();
  const [backgroundStatus] = Location.useBackgroundPermissions();
  const [foregroundStatus] = Location.useForegroundPermissions();

  const [isGranted, setIsGranted] = useState<boolean | null>(null);
  const {bottomSheetRef} = useGPSModalContext();

  useEffect(() => {
    if (backgroundStatus && foregroundStatus && isGranted === null) {
      setIsGranted(backgroundStatus.granted && foregroundStatus.granted);
    }
  }, [backgroundStatus, foregroundStatus, isGranted]);

  const onBottomSheetDismiss = () => {
    setCurrentTab('Map');
  };
  useFocusEffect(() => {
    return () => bottomSheetRef?.current?.close();
  });

  return (
    <BottomSheetModal
      bottomInset={TAB_BAR_HEIGHT}
      style={styles.modal}
      ref={bottomSheetRef}
      enableDynamicSizing
      onDismiss={onBottomSheetDismiss}
      handleComponent={() => null}>
      <BottomSheetView>
        {isGranted ? (
          <GPSPermissionsEnabled />
        ) : (
          <GPSPermissionsDisabled setIsGranted={setIsGranted} />
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
