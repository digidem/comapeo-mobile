import type {ReadonlyDeep} from 'type-fest';

export default function generateMetricsReport({
  packageJson,
}: ReadonlyDeep<{
  packageJson: {version: string};
}>) {
  return {
    type: 'metrics-v1',
    appVersion: packageJson.version,
  };
}
