import * as React from 'react';
import {Observation, Preset} from '@mapeo/schema';
import {useObservationsQuery} from '../hooks/server/observation/useObservationsQuery';
import {Loading} from '../sharedComponents/Loading';
import {Text} from '../sharedComponents/Text';
import {usePresetsQuery} from '../hooks/server/usePresetsQuery';

export type ObservationsMap = Map<string, Observation>;

type ObservationContextType = {
  observations: ObservationsMap;
  presets: Preset[];
};

const ObservationContext = React.createContext<ObservationContextType>({
  observations: new Map(),
  presets: [],
});

export const useObservationContext = () => React.useContext(ObservationContext);

export const ObservationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const observationsQuery = useObservationsQuery();
  const presetsQuery = usePresetsQuery();

  const observations = React.useMemo(() => {
    if (!observationsQuery.data) return new Map();

    return new Map(observationsQuery.data.map(obs => [obs.docId, obs]));
  }, [observationsQuery.data]);

  if (presetsQuery.data && observationsQuery.data) {
    return (
      <ObservationContext.Provider
        value={{observations, presets: presetsQuery.data}}>
        {children}
      </ObservationContext.Provider>
    );
  }

  if (observationsQuery.isError || presetsQuery.isError) {
    <Text>Error</Text>;
  }

  return <Loading />;
};
