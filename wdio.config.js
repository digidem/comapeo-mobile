// @ts-check
const path = require('path');
const prNumber = process.env.GITHUB_PR_NUMBER || 'Manual Run';
const prTitle = process.env.GITHUB_PR_TITLE || 'Manual Trigger';
const timestamp = new Date().toISOString();
// Type is very questionably declared in the global namespace via @wdio/types
/** @type {WebdriverIO.Config} */

const config = {
  runner: 'local',
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  specs: [path.resolve(__dirname, 'tests/e2e/specs/flow.test.ts')],
  maxInstances: 1,
  services: [
    [
      'browserstack',
      {
        app: process.env.BROWSERSTACK_APP_URL,
        buildIdentifier: prNumber,
        browserstackLocal: true,
        testObservability: true,
        testObservabilityOptions: {
          projectName: 'CoMapeo',
          buildName: `PR #${prNumber} – ${prTitle}`,
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
        buildName: `PR #${prNumber} – ${prTitle}`,
        sessionName: `Spec Run – ${timestamp}`,
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
