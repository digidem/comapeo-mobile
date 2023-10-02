import * as React from 'react';
import {
  BackHandler,
  LayoutChangeEvent,
  NativeEventSubscription,
  useWindowDimensions,
} from 'react-native';
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {Backdrop} from './Backdrop';
import {BLACK, DARK_GREY, LIGHT_GREY, MEDIUM_GREY} from '../../lib/styles';

const MIN_SHEET_HEIGHT = 400;

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
      sheetRef.current.dismiss();
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

const useSnapPointsCalculator = () => {
  const [sheetHeight, setSheetHeight] = React.useState(1);

  const {height: windowHeight} = useWindowDimensions();

  const snapPoints = React.useMemo(() => [sheetHeight], [sheetHeight]);

  const updateSheetHeight: (props: LayoutChangeEvent) => void =
    React.useCallback(
      ({
        nativeEvent: {
          layout: {height},
        },
      }) => {
        const newSheetHeight = Math.max(windowHeight * 0.75, height);
        setSheetHeight(newSheetHeight);
      },
      [windowHeight],
    );

  return {snapPoints, updateSheetHeight};
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
  ({children, isOpen, onDismiss, onBack, disableBackrop}, ref) => {
    useBackHandler(isOpen, onBack);

    const {snapPoints, updateSheetHeight} = useSnapPointsCalculator();

    return (
      <RNBottomSheetModal
        ref={ref}
        backdropComponent={disableBackrop ? null : Backdrop}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        handleComponent={() => null}
        index={0}
        onDismiss={onDismiss}
        snapPoints={snapPoints}>
        <BottomSheetView
          onLayout={props => {
            updateSheetHeight(props);
          }}
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 30,
            borderColor: LIGHT_GREY,
            borderWidth: 2,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}>
          {children}
        </BottomSheetView>
      </RNBottomSheetModal>
    );
  },
);

export {BottomSheetContent} from '../BottomSheet';
