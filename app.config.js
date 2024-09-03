const SUFFIX =
  {
    development: '.dev',
    production: '',
    releaseCandidate: '.rc',
    preRelease: 'pre',
  }[process.env.APP_VARIANT] ?? '';

const NAME =
  {
    development: ' Dev',
    production: '',
    releaseCandidate: ' Rc',
    preRelease: ' Pre',
  }[process.env.APP_VARIANT] ?? '';

const VERSION = process.env.VERSION ?? 'unknown';
const LATEST_SHA = process.env.COMMIT_SHA;

/**
 * @param {object} opts
 * @param {import('@expo/config-types').ExpoConfig} opts.config
 *
 * @returns {import('@expo/config-types').ExpoConfig}
 */
module.exports = ({config}) => ({
  ...config,
  version: LATEST_SHA ? `${VERSION}+${LATEST_SHA}` : VERSION,
  extra: {
    ...config.extra,
    eas: {
      projectId: '2d5b8137-12ec-45aa-9c23-56b6a1c522b7',
    },
  },
  name: 'CoMapeo' + NAME,
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.comapeo' + SUFFIX,
  },
  android: {
    ...config.android,
    package: 'com.comapeo' + SUFFIX,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
  updates: {
    url: 'https://u.expo.dev/2d5b8137-12ec-45aa-9c23-56b6a1c522b7',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
