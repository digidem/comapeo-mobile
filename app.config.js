const {execSync} = require('child_process');

const APP_VARIANT = process.env.APP_VARIANT;

/** @type {string} */
const APP_ID_SUFFIX =
  {
    development: '.dev',
    production: '',
    releaseCandidate: '.rc',
    preRelease: '.pre',
  }[APP_VARIANT] ?? '.dev';

/** @type {string} */
const APP_NAME_SUFFIX =
  {
    development: ' Dev',
    production: '',
    releaseCandidate: ' Rc',
    preRelease: ' Pre',
  }[APP_VARIANT] ?? ' Dev';

const pkgVersion = require('./package.json').version;
const pkgVersionBase = pkgVersion.replace(/-.*/, '');

/** @type {string} */
let appVersionSuffix =
  {
    development: '-dev',
    production: '',
    releaseCandidate: '-rc',
    preRelease: '-pre',
  }[APP_VARIANT] ?? '-dev';

if (APP_VARIANT !== 'production') {
  try {
    // SHA of commit this version was built from
    const commitSha =
      process.env.EAS_BUILD_GIT_COMMIT_HASH ||
      execSync('git rev-parse HEAD').toString().trim();
    const commitShaShort = commitSha.slice(0, 7);
    appVersionSuffix += `+${commitShaShort}`;
  } catch (e) {
    // Expo-doctor runs in a temp directory which is not a git repo, so this command will fail.
  }
}

const versionName = `${pkgVersionBase}${appVersionSuffix}`;

/**
 * @param {object} opts
 * @param {import('@expo/config-types').ExpoConfig} opts.config
 *
 * @returns {import('@expo/config-types').ExpoConfig}
 */
module.exports = ({config}) => ({
  ...config,
  version: versionName,
  extra: {
    ...config.extra,
    eas: {
      projectId: '2d5b8137-12ec-45aa-9c23-56b6a1c522b7',
    },
  },
  name: 'CoMapeo' + APP_NAME_SUFFIX,
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.comapeo' + APP_ID_SUFFIX,
  },
  android: {
    ...config.android,
    package: 'com.comapeo' + APP_ID_SUFFIX,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
  updates: {
    url: 'https://u.expo.dev/2d5b8137-12ec-45aa-9c23-56b6a1c522b7',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
