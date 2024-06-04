import type {ReadonlyDeep} from 'type-fest';
import type {Platform} from 'react-native';
import type {Observation} from '@mapeo/schema';
import positionToCountries from './positionToCountries';

export default function generateMetricsReport({
  packageJson,
  os,
  osVersion,
  screen,
  observations,
}: ReadonlyDeep<{
  packageJson: {version: string};
  os: Platform['OS'] | NodeJS.Platform;
  osVersion: number | string;
  screen: {width: number; height: number};
  observations: ReadonlyArray<Pick<Observation, 'lat' | 'lon'>>;
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
    screen,
    ...(countries.size ? {countries: Array.from(countries)} : {}),
  };
}

function addToSet<T>(set: Set<T>, toAdd: Iterable<T>): void {
  for (const item of toAdd) set.add(item);
}
