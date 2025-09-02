// @ts-check
const path = require('path');
const shortSha = process.env.GITHUB_SHORT_SHA || 'manual';
const prTitle = process.env.GITHUB_PR_TITLE;
// Type is very questionably declared in the global namespace via @wdio/types
/** @type {WebdriverIO.Config} */

const config = {
  runner: 'local',
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  specs: [
    path.resolve(__dirname, 'tests/e2e/specs/audio/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/exchange/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/multiple-projects/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/observations/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/onboarding/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/passcode/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/settings/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/solo-project/index.tsx'),
    path.resolve(__dirname, 'tests/e2e/specs/tracks/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/remote-archive/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/photos/index.test.ts'),
  ],
  maxInstances: 5,
  services: [
    [
      'browserstack',
      {
        app: process.env.BROWSERSTACK_APP_URL,
        buildIdentifier: '#${DATE_TIME}',
        browserstackLocal: true,
        testObservability: true,
        testObservabilityOptions: {
          projectName: 'CoMapeo',
          buildName: `${prTitle || 'Manual Run'} – ${shortSha}`,
        },
      },
    ],
  ],
  capabilities: [
    {
      platformName: 'android',
      'appium:platformVersion': '13.0',
      'appium:deviceName': 'Google Pixel 7',
      'appium:automationName': 'UIAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'appium:autoGrantPermissions': true,
      'bstack:options': {
        projectName: 'CoMapeo',
        buildName: `${prTitle || 'Manual Run'} – ${shortSha}`,
        sessionName: `E2E: ${shortSha}`,
        appiumVersion: '2.12.1',
        debug: true,
        networkLogs: true,
        gpsLocation: '0.198214, 78.472225',
      },
    },
  ],
  logLevel: 'error',
  waitforTimeout: 5000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 2,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000,
  },
  reporters: [
    [
      'spec',
      {
        addConsoleLogs: true,
      },
    ],
  ],
  outputDir: './test-results',
};

module.exports = {
  config,
};
