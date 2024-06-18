import * as React from 'react';
import {
  BackHandler,
  NativeEventSubscription,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {DARK_GREY} from '../../lib/styles';

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
      setIsOpen(false);
      sheetRef.current.close();
    }
  }, []);

  const openSheet = React.useCallback(() => {
    if (sheetRef.current) {
      setIsOpen(true);
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
      }
      sheetRef.current.present();
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
  fullScreen?: boolean;
}

export const BottomSheetModal = React.forwardRef<RNBottomSheetModal, Props>(
  ({children, isOpen, onBack, onDismiss, fullScreen}, ref) => {
    useBackHandler(isOpen, onBack);

    const {top} = useSafeAreaInsets();

    return (
      <RNBottomSheetModal
        enableDynamicSizing
        ref={ref}
        backgroundStyle={
          fullScreen ? styles.backgroundFullScreen : styles.backgroundDynamic
        }
        backdropComponent={DefaultBackdrop}
        onDismiss={onDismiss}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        handleComponent={() => null}>
        <BottomSheetView style={fullScreen ? {paddingTop: top} : undefined}>
          {children}
        </BottomSheetView>
      </RNBottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  backgroundDynamic: {borderWidth: 1, borderColor: DARK_GREY},
  backgroundFullScreen: {borderRadius: 0},
});

function DefaultBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      pressBehavior="none"
      disappearsOnIndex={-1}
    />
  );
}

export {BottomSheetContent} from '../BottomSheet';
