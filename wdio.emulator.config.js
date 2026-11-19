// @ts-check
const path = require('path');

/** @type {WebdriverIO.Config} */

const config = {
  runner: 'local',
  specs: [path.resolve(__dirname, 'tests/e2e/specs/onboarding/index.test.ts')],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'android',
      'appium:platformVersion': '13',
      'appium:deviceName': 'emulator-5554',
      'appium:automationName': 'UIAutomator2',
      'appium:app': path.resolve(__dirname, 'app.apk'),
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 150,
    },
  ],
  hostname: '127.0.0.1',
  port: 4723,
  logLevel: 'error',
  waitforTimeout: 5000,
  connectionRetryTimeout: 240000,
  connectionRetryCount: 3,
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
