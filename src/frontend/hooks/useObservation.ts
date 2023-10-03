import {useObservationQuery} from './server/useObservationQuery';
import {usePresets} from './server/usePresets';

export function useObservation(observationId: string) {
  const {data: presets} = usePresets();
  const observationQuery = useObservationQuery(observationId);

  return {
    preset:
      observationQuery.data &&
      observationQuery.data.tags &&
      'categoryId' in observationQuery.data.tags &&
      presets
        ? presets.find(
            pres => pres.docId === observationQuery.data.tags.categoryId,
          )
        : undefined,
    observationQuery,
  };
}
