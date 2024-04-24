import React, {createContext, useContext} from 'react';
import {useCurrentTrackStore} from '../hooks/tracks/useCurrentTrackStore';
import {useFormattedTimeSince} from '../hooks/useFormattedTimeSince';

interface TrackTimerContext {
  timer: string;
}

const TrackTimerContext = createContext<TrackTimerContext | null>(null);

const TrackTimerContextProvider = ({children}: {children: React.ReactNode}) => {
  const trackingSince = useCurrentTrackStore(state => state.trackingSince);
  const timer = useFormattedTimeSince(trackingSince ?? new Date(), 1000);

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
