import type {Observation} from '@mapeo/schema';

export default function (observations: ReadonlyArray<Observation>) {
  const networkAvailability = observations
    .map(obs => obs.metadata?.positionProvider?.networkAvailable)
    .filter(networkAvailable => networkAvailable !== undefined);

  const trues = networkAvailability.filter(Boolean);
  return (trues.length / networkAvailability.length) * 100;
}
