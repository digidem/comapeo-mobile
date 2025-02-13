// @ts-check
const path = require('path');
// Type is very questionably declared in the global namespace via @wdio/types
/** @type {WebdriverIO.Config} */

const config = {
  runner: 'local',
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  specs: [path.resolve(__dirname, '../specs/flow.test.ts')],
  maxInstances: 1,
  services: [
    [
      'browserstack',
      {
        app: process.env.BROWSERSTACK_APP_URL,
        buildIdentifier: `${process.env.BUILD_NUMBER || `build-${new Date().toISOString()}`}`,
        browserstackLocal: true,
        testObservability: true,
        testObservabilityOptions: {
          projectName: 'CoMapeo',
          buildName: `CoMapeo E2E Tests - ${new Date().toISOString()}`,
        },
      },
    ],
  ],
  capabilities: [
    {
      platformName: 'android',
      'appium:platformVersion': '12.0',
      'appium:deviceName': 'Samsung Galaxy S22 Ultra',
      'appium:automationName': 'UIAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'appium:autoGrantPermissions': true,
      'bstack:options': {
        projectName: 'CoMapeo',
        buildName: 'CoMapeo Android Build',
        sessionName: 'Run Android e2e tests',
        appiumVersion: '2.12.1',
        debug: true,
        networkLogs: true,
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
