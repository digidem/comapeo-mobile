import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function useBottomPaddingWithSafeArea() {
  const insets = useSafeAreaInsets();
  const bottom =
    Platform.OS === 'android'
      ? insets.bottom + 20
      : Math.max(insets.bottom, 20);
  return bottom;
}
