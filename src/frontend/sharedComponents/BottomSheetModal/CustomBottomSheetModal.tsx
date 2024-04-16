import React, {FC} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {TAB_BAR_HEIGHT} from '../../Navigation/ScreenGroups/AppScreens';

interface CustomBottomSheetModal {
  dismiss: () => void;
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
}

export const CustomBottomSheetModal: FC<CustomBottomSheetModal> = ({
  dismiss,
  bottomSheetRef,
  currentIndex,
  setCurrentIndex,
  children,
}) => {
  return (
    <>
      <TouchableWithoutFeedback onPress={dismiss}>
        <View
          pointerEvents={currentIndex === 0 ? 'auto' : 'none'}
          style={styles.wrapper}
        />
      </TouchableWithoutFeedback>
      <BottomSheetModal
        bottomInset={TAB_BAR_HEIGHT}
        style={styles.modal}
        ref={bottomSheetRef}
        onChange={setCurrentIndex}
        enableDynamicSizing
        enableDismissOnClose
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        handleComponent={() => null}>
        <BottomSheetView>{children}</BottomSheetView>
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
