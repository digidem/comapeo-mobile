import * as React from 'react';
import {Observation, Preset} from '@mapeo/schema';
import {useObservationsQuery} from '../hooks/server/useObservationsQuery';
import {Loading} from '../sharedComponents/Loading';
import {Text} from '../sharedComponents/Text';
import {usePresetsQuery} from '../hooks/server/usePresetsQuery';

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
  const observationsQuery = useObservationsQuery();

  const observations = React.useMemo(() => {
    if (!observationsQuery.data) return new Map();

    return new Map(observationsQuery.data.map(obs => [obs.docId, obs]));
  }, [observationsQuery.data]);

  if (observationsQuery.isLoading) {
    <Loading />;
  }

  if (observationsQuery.isError) {
    <Text>Error</Text>;
  }

  return (
    <ObservationContext.Provider value={{observations}}>
      {children}
    </ObservationContext.Provider>
  );
};
