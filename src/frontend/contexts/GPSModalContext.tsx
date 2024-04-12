import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {createContext, useContext, useRef} from 'react';

interface GPSModalContext {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
}

const GPSModalContext = createContext<GPSModalContext | null>(null);

const GPSModalContextProvider = ({children}: {children: React.ReactNode}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <GPSModalContext.Provider value={{bottomSheetRef}}>
      {children}
    </GPSModalContext.Provider>
  );
};

function useGPSModalContext() {
  const context = useContext(GPSModalContext);
  if (!context) {
    throw new Error(
      'useBottomSheetContext must be used within a BottomSheetContextProvider',
    );
  }
  return context;
}

export {GPSModalContextProvider, useGPSModalContext};
