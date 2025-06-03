import React, {createContext, useContext} from 'react';
import {useFormattedTimeSince} from '../hooks/useFormattedTimeSince';
import {useTrackState} from './TrackStoreContext';

interface TrackTimerContext {
  timer: string;
}

const TrackTimerContext = createContext<TrackTimerContext | null>(null);

const TrackTimerContextProvider = ({children}: {children: React.ReactNode}) => {
  const trackingSince = useTrackState(store => store.startTime);
  const timer = useFormattedTimeSince(trackingSince, 1000);

  return (
    <TrackTimerContext.Provider value={{timer}}>
      {children}
    </TrackTimerContext.Provider>
  );
};

function useTrackTimerContext() {
  const context = useContext(TrackTimerContext);
  if (!context) {
    throw new Error(
      'useTrackTimerContext must be used within a TrackTimerContextProvider',
    );
  }
  return context;
}

export {TrackTimerContextProvider, useTrackTimerContext};
