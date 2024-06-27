import type {ReadonlyDeep} from 'type-fest';
import type {Observation} from '@mapeo/schema';

export function getPercentageOfNetworkAvailability(
  observations: ReadonlyDeep<Array<Partial<Observation>>>,
) {
  const networkAvailability = observations
    .map(obs => obs.metadata?.positionProvider?.networkAvailable)
    .filter(networkAvailable => networkAvailable !== undefined);
  const networkIsAvailable = networkAvailability.filter(Boolean);
  if (networkAvailability.length === 0) return 0;
  return Number(
    ((networkIsAvailable.length / networkAvailability.length) * 100).toFixed(2),
  );
}
