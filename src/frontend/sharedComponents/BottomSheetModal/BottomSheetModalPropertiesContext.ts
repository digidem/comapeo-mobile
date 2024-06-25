import {createContext, useContext} from 'react';

export const BottomSheetModalPropertiesContext = createContext<{
  fullScreen: boolean;
} | null>(null);

export function useBottomSheetModalProperties() {
  const value = useContext(BottomSheetModalPropertiesContext);

  if (!value) {
    throw new Error('Must set up BottomSheetModalContentContext provider');
  }

  return value;
}
