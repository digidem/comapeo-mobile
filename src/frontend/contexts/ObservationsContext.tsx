import * as React from 'react';
import {Observation, Preset} from '@mapeo/schema';
import {Loading} from '../sharedComponents/Loading';
import {Text} from '../sharedComponents/Text';
import {usePresetsQuery} from '../hooks/server/presets';
import {useObservations} from '../hooks/server/observations';
import {useProject} from '../hooks/server/projects';
import {MockPreset} from '../mockdata';

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
  const observationsQuery = useObservations();
  const presetsQuery = usePresetsQuery();
  const project = useProject();

  const observations = React.useMemo(() => {
    if (!observationsQuery.data) return new Map();

    return new Map(observationsQuery.data.map(obs => [obs.docId, obs]));
  }, [observationsQuery.data]);

  console.log(project.data);

  if (
    presetsQuery.fetchStatus === 'idle' &&
    !presetsQuery.data &&
    project.data
  ) {
    console.log('are we here?');
    console.log(MockPreset);
    MockPreset.forEach(pres => project.data.preset.create(pres));
  }

  if (presetsQuery.isLoading && observationsQuery.isLoading) {
    <Loading />;
  }

  if (observationsQuery.isError || presetsQuery.isError) {
    <Text>Error</Text>;
  }

  return (
    <ObservationContext.Provider
      // @ts-expect-error
      value={{observations, presets: presetsQuery.data}}>
      {children}
    </ObservationContext.Provider>
  );
};
