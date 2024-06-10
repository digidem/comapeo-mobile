import type {ReadonlyDeep} from 'type-fest';
import type {Observation} from '@mapeo/schema';
import positionToCountries from './positionToCountries';
import {getPercentageOfNetworkAvailability} from './getPercentageOfNetworkAvailability';
import {addToSet} from './utils';

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
