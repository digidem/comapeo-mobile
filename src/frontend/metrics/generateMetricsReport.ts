import type {ReadonlyDeep} from 'type-fest';
import type {Platform} from 'react-native';
import type {Observation} from '@mapeo/schema';
import {positionToCountries} from './positionToCountries';
import {getPercentageOfNetworkAvailability} from './networkAvailability';
import {addToSet} from './../lib/addToSet';

export function generateMetricsReport({
  packageJson,
  os,
  osVersion,
  screen,
  supportedAbis,
  observations,
}: ReadonlyDeep<{
  packageJson: {version: string};
  os: Platform['OS'] | NodeJS.Platform;
  osVersion: number | string;
  screen: {width: number; height: number};
  supportedAbis: string[];
  observations: ReadonlyDeep<Array<Partial<Observation>>>;
}>) {
  const [arch] = supportedAbis;

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
    ...(arch ? {arch} : {}),
    ...(countries.size ? {countries: Array.from(countries)} : {}),
    percentageOfNetworkAvailability:
      getPercentageOfNetworkAvailability(observations),
  };
}
