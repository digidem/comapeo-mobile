import type {ReadonlyDeep} from 'type-fest';

export default function generateMetricsReport({
  packageJson,
  os,
  osVersion,
  screen,
}: ReadonlyDeep<{
  packageJson: {version: string};
  os: string;
  osVersion: number | string;
  screen: {width: number; height: number};
}>) {
  return {
    type: 'metrics-v1',
    appVersion: packageJson.version,
    os,
    osVersion,
    screen,
  };
}
