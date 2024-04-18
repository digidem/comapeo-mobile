import type {ReadonlyDeep} from 'type-fest';

export default function generateMetricsReport({
  packageJson,
  os,
  osVersion,
}: ReadonlyDeep<{
  packageJson: {version: string};
  os: string;
  osVersion: number | string;
}>) {
  return {
    type: 'metrics-v1',
    appVersion: packageJson.version,
    os,
    osVersion,
  };
}
