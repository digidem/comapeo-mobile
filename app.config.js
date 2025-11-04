const {execSync} = require('child_process');
const semverParse = require('semver/functions/parse');

/** @import {ExpoConfig} from '@expo/config-types' */
/** @typedef {typeof VALID_APP_VARIANTS[number]} AppVariant */

const EAS_PROJECT_ID = '2d5b8137-12ec-45aa-9c23-56b6a1c522b7';
const EAS_UPDATES_URL = 'https://u.expo.dev/' + EAS_PROJECT_ID;
const VALID_APP_VARIANTS = /** @type (const) */ ([
  'development',
  'production',
  'releaseCandidate',
  'preRelease',
]);

const APP_VARIANT = process.env.APP_VARIANT || 'development';
validateAppVariant(APP_VARIANT);
const APP_VERSION = process.env.APP_VERSION;
validateAppVersion(APP_VERSION);

// --- START: App name, ID, and versioning ---
//
// These constants define the suffixes used for the app name, the app ID (bundle
// identifier/package name), and the version pre-release suffix based on the
// APP_VARIANT.
const APP_ID_BASE = 'com.comapeo';
const VARIANT_TO_APP_ID_SUFFIX =
  /** @satisfies {Record<AppVariant, string>} */ ({
    development: '.dev',
    production: '',
    releaseCandidate: '.rc',
    preRelease: '.pre',
  });
const APP_NAME_BASE = 'CoMapeo';
const VARIANT_TO_APP_NAME_SUFFIX =
  /** @satisfies {Record<AppVariant, string>} */ ({
    development: ' Dev',
    production: '',
    releaseCandidate: ' RC',
    preRelease: ' Pre',
  });
const VARIANT_TO_VERSION_PRE_RELEASE =
  /** @satisfies {Record<AppVariant, string>} */ ({
    development: '-dev',
    production: '',
    releaseCandidate: '-rc',
    preRelease: '-pre',
  });
const APP_ID = /** @type {const} */ (
  `${APP_ID_BASE}${VARIANT_TO_APP_ID_SUFFIX[APP_VARIANT]}`
);
const APP_NAME = /** @type {const} */ (
  `${APP_NAME_BASE}${VARIANT_TO_APP_NAME_SUFFIX[APP_VARIANT]}`
);
const VERSION_PRE_RELEASE_SUFFIX = /** @type {const} */ (
  `${VARIANT_TO_VERSION_PRE_RELEASE[APP_VARIANT]}`
);
// --- END: App name, ID, and versioning ---

/** @type {({config}: {config: ExpoConfig}): ExpoConfig} */
module.exports = ({config}) => {
  const versionName = APP_VERSION || generateVersionName();

  return {
    ...config,
    version: versionName,
    extra: {
      ...config.extra,
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    name: APP_NAME,
    ios: {
      ...config.ios,
      bundleIdentifier: APP_ID,
    },
    android: {
      ...config.android,
      package: APP_ID,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    updates: {
      url: EAS_UPDATES_URL,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  };
};

/**
 * Validates that the provided variant is one of:
 * - development
 * - production
 * - releaseCandidate
 * - preRelease
 * @param {string} variant
 * @throws {Error} if the variant is invalid
 * @returns {asserts variant is AppVariant}
 */
function validateAppVariant(variant) {
  if (
    !variant ||
    !VALID_APP_VARIANTS.includes(/** @type {AppVariant} */ (variant))
  ) {
    throw new Error(
      `Invalid APP_VARIANT: ${variant}. Must be one of: ${VALID_APP_VARIANTS.join(', ')}.`,
    );
  }
}

/**
 * Validates that the version name, if provided, is of the format:
 * <minor>.<patch>[-<pre-release>[.<pre-release-patch>]]
 * where:
 * - <minor> is a non-negative integer
 * - <patch> is a non-negative integer
 * - <pre-release> is one of: dev, rc, pre
 * - <pre-release-patch> is a non-negative integer
 * @param {string | undefined} version
 * @throws {Error} if the version is invalid
 * @returns {void}
 */
function validateAppVersion(version) {
  if (!version) return;
  const regex = /^\d+\.\d+(-(?:dev|rc|pre)(\.\d+)?)?$/;
  if (!regex.test(version)) {
    throw new Error(
      `Invalid APP_VERSION: ${version}. Must be of the format <minor>.<patch>[-<pre-release>[.<pre-release-patch>]], where <pre-release> is one of: dev, rc, pre.`,
    );
  }
}

function generateVersionName() {
  const commitShaShort = getCommitShaShort();
  let versionName = `${getVersionNameBase()}${VERSION_PRE_RELEASE_SUFFIX}`;

  // Append commit SHA as version metadata only for non-production builds to help with debugging
  if (commitShaShort && APP_VARIANT !== 'production') {
    versionName += `+${commitShaShort}`;
  }
  return versionName;
}

function getVersionNameBase() {
  const pkgVersion = require('./package.json').version;
  if (typeof pkgVersion !== 'string') {
    throw new Error('Invalid package version in package.json');
  }
  const parsedVersion = semverParse(pkgVersion);
  if (!parsedVersion) {
    throw new Error(`Invalid package version format: ${pkgVersion}`);
  }
  return `${parsedVersion.minor}.${parsedVersion.patch}`;
}

function getCommitShaShort() {
  try {
    // SHA of commit this version was built from
    const commitSha =
      process.env.EAS_BUILD_GIT_COMMIT_HASH ||
      execSync('git rev-parse HEAD').toString().trim();
    return commitSha.slice(0, 7);
  } catch (error) {
    // Expo-doctor runs in a temp directory which is not a git repo, so this command will fail.
    console.warn('Could not get commit SHA:', error);
  }
}
