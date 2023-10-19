import * as React from 'react';
import {BackHandler, NativeEventSubscription} from 'react-native';
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {LIGHT_GREY} from '../../lib/styles';

export const MODAL_NAVIGATION_OPTIONS: NativeStackNavigationOptions = {
  presentation: 'transparentModal',
  animation: 'none',
};

export const useBottomSheetModal = ({openOnMount}: {openOnMount: boolean}) => {
  const initiallyOpenedRef = React.useRef(false);
  const sheetRef = React.useRef<RNBottomSheetModal>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const closeSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.close();
      setIsOpen(false);
    }
  }, []);

  const openSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.present();
      setIsOpen(true);
    }
  }, []);

  React.useEffect(() => {
    if (!initiallyOpenedRef.current && openOnMount) {
      initiallyOpenedRef.current = true;
      openSheet();
    }
  }, [openOnMount, openSheet]);

  return {sheetRef, closeSheet, openSheet, isOpen};
};

const useBackHandler = (enable: boolean, onBack?: () => void) => {
  React.useEffect(() => {
    let subscription: NativeEventSubscription;

    if (enable) {
      // This event is triggered by both Android hardware back press and gesture back swipe
      subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (onBack) {
          onBack();
        }

        return true;
      });
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [enable, onBack]);
};

interface Props extends React.PropsWithChildren<{}> {
  isOpen: boolean;
  onDismiss?: () => void;
  // Triggered by: Android hardware back press and gesture back swipe
  onBack?: () => void;
  snapPoints?: (string | number)[];
  disableBackrop?: boolean;
}

export const BottomSheetModal = React.forwardRef<RNBottomSheetModal, Props>(
  ({children, isOpen, onBack, disableBackrop}, ref) => {
    useBackHandler(isOpen, onBack);

    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => {
        return (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="none"
            disappearsOnIndex={-1}
          />
        );
      },
      [BottomSheetBackdrop],
    );

    return (
      <RNBottomSheetModal
        ref={ref}
        backdropComponent={disableBackrop ? null : renderBackdrop}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        enableDynamicSizing
        handleComponent={() => null}>
        <BottomSheetView
          style={{
            padding: 20,
            paddingTop: 30,
            // need to add paddingbottom due to bug: https://github.com/gorhom/react-native-bottom-sheet/issues/791
            paddingBottom: 20,
            borderColor: LIGHT_GREY,
            borderWidth: 1,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}>
          {children}
        </BottomSheetView>
      </RNBottomSheetModal>
    );
  },
);

export {BottomSheetContent} from '../BottomSheet';
