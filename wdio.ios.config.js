// @ts-check
const path = require('path');

/** @type {WebdriverIO.Config} */
const config = {
  runner: 'local',
  specs: [
    path.resolve(__dirname, 'tests/e2e/specs/passcode/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/audio/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/exchange/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/multiple-projects/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/observations/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/onboarding/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/settings/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/solo-project/index.tsx'),
    path.resolve(__dirname, 'tests/e2e/specs/team/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/tracks/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/menu/index.test.ts'),
  ],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone 16',
      'appium:platformVersion': '26.2',
      'appium:udid': '51E77953-3273-4F4D-9ADF-167BBF1DD8E5',
      'appium:app': path.resolve(
        __dirname,
        'ios/build/Build/Products/Debug-iphonesimulator/CoMapeoRC.app',
      ),
      'appium:bundleId': 'com.comapeo.rc',
      'appium:autoAcceptAlerts': true,
      'appium:newCommandTimeout': 300,
      // The Debug build loads JS from Metro; keep the app between sessions
      // so the embedded NodeMobile backend doesn't churn unnecessarily.
      'appium:noReset': false,
    },
  ],
  hostname: '127.0.0.1',
  port: 4723,
  logLevel: 'error',
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  specFileRetries: 2,
  specFileRetriesDeferred: false,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000,
  },
  reporters: [['spec', {addConsoleLogs: true}]],
  outputDir: './test-results-ios',
};

module.exports = {config};
