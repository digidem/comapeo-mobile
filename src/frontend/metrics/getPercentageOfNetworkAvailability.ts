import type {Observation} from '@mapeo/schema';

export function getPercentageOfNetworkAvailability(
  observations: ReadonlyArray<Observation>,
) {
  const networkAvailability = observations
    .map(obs => obs.metadata?.positionProvider?.networkAvailable)
    .filter(networkAvailable => networkAvailable !== undefined);
  const networkIsAvailable = networkAvailability.filter(Boolean);
  return (networkIsAvailable.length / networkAvailability.length) * 100;
}
