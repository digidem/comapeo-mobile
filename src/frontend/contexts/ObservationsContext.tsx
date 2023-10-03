import * as React from 'react';
import {Observation} from '@mapeo/schema';
import {useObservations} from '../hooks/server/useObservations';
import {Loading} from '../sharedComponents/Loading';
import {Text} from '../sharedComponents/Text';

export type ObservationsMap = Map<string, Observation>;

type ObservationContextType = {
  observations: ObservationsMap;
};

const ObservationContext = React.createContext<ObservationContextType>({
  observations: new Map(),
});

export const useObservationContext = () => React.useContext(ObservationContext);

export const ObservationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {data, isLoading, isError} = useObservations();

  const observations = React.useMemo(() => {
    if (!data) return new Map();

    return new Map(data.map(obs => [obs.docId, obs]));
  }, [data]);

  if (isLoading) {
    <Loading />;
  }

  if (isError) {
    <Text>Error</Text>;
  }

  return (
    <ObservationContext.Provider value={{observations}}>
      {children}
    </ObservationContext.Provider>
  );
};
