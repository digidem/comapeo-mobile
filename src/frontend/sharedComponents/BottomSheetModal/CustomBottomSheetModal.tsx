import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {TAB_BAR_HEIGHT} from '../../Navigation/ScreenGroups/AppScreens';

interface CustomBottomSheetModal {
  dismiss: () => void;
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  children: React.ReactNode;
}

export const CustomBottomSheetModal: FC<CustomBottomSheetModal> = ({
  bottomSheetRef,
  children,
}) => {
  return (
    <BottomSheetModal
      bottomInset={TAB_BAR_HEIGHT}
      style={styles.modal}
      ref={bottomSheetRef}
      snapPoints={['25%', '60%']}
      // enableDynamicSizing
      // enableContentPanningGesture={false}
      // enableHandlePanningGesture={false}
      handleComponent={() => null}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};
