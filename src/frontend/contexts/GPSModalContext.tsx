import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface GPSModalContext {
  displayModal: boolean;
  setDisplayModal: Dispatch<SetStateAction<boolean>>;
}

const GPSModalContext = createContext<GPSModalContext | null>(null);

const GPSModalContextProvider = ({children}: {children: React.ReactNode}) => {
  const [displayModal, setDisplayModal] = useState(false);

  return (
    <GPSModalContext.Provider value={{displayModal, setDisplayModal}}>
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
