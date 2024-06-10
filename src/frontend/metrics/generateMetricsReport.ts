import type {ReadonlyDeep} from 'type-fest';
import type {Observation} from '@mapeo/schema';
import positionToCountries from './positionToCountries';
import {getPercentageOfNetworkAvailability} from './getPercentageOfNetworkAvailability';

export default function generateMetricsReport({
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
  percentageOfNetworkAvailability: number;
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

export function addToSet<T>(set: Set<T>, toAdd: Iterable<T>): void {
  for (const item of toAdd) set.add(item);
}
