import React, {useRef} from 'react';
import {SafeAreaView} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {SaveTrackHeader} from './saveTrack/SaveTrackHeader';
import {DiscardTrackModal} from './saveTrack/DiscardTrackModal';

export const SaveTrackScreen = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <SafeAreaView>
      <SaveTrackHeader bottomSheetRef={bottomSheetRef} />
      <DiscardTrackModal bottomSheetRef={bottomSheetRef} />
    </SafeAreaView>
  );
};
