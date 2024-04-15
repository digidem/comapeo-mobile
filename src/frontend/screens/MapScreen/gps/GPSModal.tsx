import React, {useEffect, useState} from 'react';
import {GPSDisabled} from './GPSDisabled';
import {GPSEnabled} from './GPSEnabled';
import * as Location from 'expo-location';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useGPSModalContext} from '../../../contexts/GPSModalContext';
import {useNavigationStore} from '../../../hooks/useNavigationStore';
import {TouchableWithoutFeedback, View, StyleSheet} from 'react-native';

export const GPSModal = () => {
  const {setCurrentTab} = useNavigationStore();
  const [backgroundStatus] = Location.useBackgroundPermissions();
  const [foregroundStatus] = Location.useForegroundPermissions();

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isGranted, setIsGranted] = useState<boolean | null>(null);
  const {bottomSheetRef} = useGPSModalContext();

  useEffect(() => {
    if (backgroundStatus && foregroundStatus && isGranted === null) {
      setIsGranted(backgroundStatus.granted && foregroundStatus.granted);
    }
  }, [backgroundStatus, foregroundStatus]);

  const onBottomSheetDismiss = () => {
    setCurrentTab('Map');
    bottomSheetRef.current?.close();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={onBottomSheetDismiss}>
        <View
          pointerEvents={currentIndex === 0 ? 'auto' : 'none'}
          style={styles.wrapper}
        />
      </TouchableWithoutFeedback>
      <BottomSheetModal
        bottomInset={48}
        style={styles.modal}
        ref={bottomSheetRef}
        onChange={setCurrentIndex}
        enableDynamicSizing
        enableDismissOnClose
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        handleComponent={() => null}>
        <BottomSheetView>
          {isGranted ? (
            <GPSEnabled />
          ) : (
            <GPSDisabled setIsGranted={setIsGranted} />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  modal: {borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
});
