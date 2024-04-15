import React, {useEffect, useState} from 'react';
import {GPSDisabled} from './GPSDisabled';
import {GPSEnabled} from './GPSEnabled';
import * as Location from 'expo-location';
import {useGPSModalContext} from '../../../contexts/GPSModalContext';
import {useNavigationStore} from '../../../hooks/useNavigationStore';
import {CustomBottomSheetModal} from '../../../sharedComponents/BottomSheetModal/CustomBottomSheetModal';

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
  }, [backgroundStatus, foregroundStatus, isGranted]);

  const onBottomSheetDismiss = () => {
    setCurrentTab('Map');
    bottomSheetRef.current?.close();
  };

  return (
    <CustomBottomSheetModal
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      dismiss={onBottomSheetDismiss}
      bottomSheetRef={bottomSheetRef}>
      {isGranted ? <GPSEnabled /> : <GPSDisabled setIsGranted={setIsGranted} />}
    </CustomBottomSheetModal>
  );
};
