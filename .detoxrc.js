const DEVICE_NAME = process.env.DEVICE_NAME || 'OnePlus 8';
const DEVICE_OS_VERSION = process.env.DEVICE_OS_VERSION || '10.0';
const BUILD_ID = process.env.BUILD_ID || 'Internal';

/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e-detox/jest.config.ts',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [8081],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && EXPO_PUBLIC_IS_E2E=TRUE ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
    'android.cloud.release': {
      type: 'android.cloud',
      app: process.env.BROWSERSTACK_APP_URL,
      appClient: process.env.BROWSERSTACK_APP_CLIENT_URL,
    },
  },
  devices: {
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_6_API_34',
      },
    },
    cloud: {
      type: 'android.cloud',
      device: {
        name: DEVICE_NAME,
        osVersion: DEVICE_OS_VERSION,
      },
    },
  },
  configurations: {
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug',
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
    'android.cloud.release': {
      device: 'cloud',
      app: 'android.cloud.release',
      cloudAuthentication: {
        username: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      },
      session: {
        server: 'wss://detox.browserstack.com/init',
        name: `${DEVICE_NAME} v${DEVICE_OS_VERSION}`,
        build: BUILD_ID,
        project: 'CoMapeo Mobile',
      },
    },
  },
};
