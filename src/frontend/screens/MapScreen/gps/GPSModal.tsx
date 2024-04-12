import React, {useEffect, useRef, useState} from 'react';
import {GPSDisabled} from './GPSDisabled';
import {GPSEnabled} from './GPSEnabled';
import {useForegroundPermissions} from 'expo-location';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useGPSModalContext} from '../../../contexts/GPSModalContext';

export const GPSModal = () => {
  const [permissions] = useForegroundPermissions();
  const [isGranted, setIsGranted] = useState<boolean | null>(null);
  const {bottomSheetRef} = useGPSModalContext();

  useEffect(() => {
    if (permissions && isGranted === null) {
      setIsGranted(permissions!.granted);
    }
  }, [permissions]);
  const onBottomSheetDismiss = () => bottomSheetRef.current?.close();
  return (
    <BottomSheetModal
      bottomInset={49}
      ref={bottomSheetRef}
      enableDynamicSizing
      onDismiss={onBottomSheetDismiss}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      handleComponent={() => null}
      backdropComponent={BottomSheetBackdrop}>
      <BottomSheetView>
        {isGranted ? (
          <GPSEnabled />
        ) : (
          <GPSDisabled setIsGranted={setIsGranted} />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
