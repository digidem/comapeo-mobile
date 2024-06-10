import type {ReadonlyDeep} from 'type-fest';
import type {Observation} from '@mapeo/schema';
import positionToCountries from './positionToCountries';
import {addToSet} from './utils';

export function generateMetricsReport({
  packageJson,
  os,
  osVersion,
  screen,
  observations,
}: ReadonlyDeep<{
  packageJson: {version: string};
  os: 'android' | 'ios' | NodeJS.Platform;
  osVersion: number | string;
  screen: {width: number; height: number};
  observations: ReadonlyArray<Observation>;
}>) {
  const countries = new Set<string>();

  for (const {lat, lon} of observations) {
    if (typeof lat === 'number' && typeof lon === 'number') {
      addToSet(countries, positionToCountries(lat, lon));
    }
  }
  return {
    type: 'metrics-v1',
    appVersion: packageJson.version,
    os,
    osVersion,
    screen: {width: screen.width, height: screen.height},
    ...(countries.size ? {countries: Array.from(countries)} : {}),
    percentageOfNetworkAvailability:
      getPercentageOfNetworkAvailability(observations),
  };
}

export function getPercentageOfNetworkAvailability(
  observations: ReadonlyArray<Observation>,
) {
  const networkAvailability = observations
    .map(obs => obs.metadata?.positionProvider?.networkAvailable)
    .filter(networkAvailable => networkAvailable !== undefined);
  const networkIsAvailable = networkAvailability.filter(Boolean);
  if (networkAvailability.length === 0) return 0;
  return (networkIsAvailable.length / networkAvailability.length) * 100;
}
