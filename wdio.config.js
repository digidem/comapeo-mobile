// @ts-check
const path = require('path');
// Type is very questionably declared in the global namespace via @wdio/types
/** @type {WebdriverIO.Config} */

const config = {
  runner: 'local',
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  specs: [path.resolve(__dirname, 'tests/e2e/specs/flow.test.ts')],
  maxInstances: 5,
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
      'appium:autoDismissAlerts': true,
      'bstack:options': {
        projectName: 'CoMapeo',
        buildName: 'Parallel Android Build',
        sessionName: 'Galaxy S22 - Android 12',
        appiumVersion: '2.12.1',
        debug: true,
        networkLogs: true,
        gpsLocation: '0.198214, 78.472225',
      },
    },
    {
      platformName: 'android',
      'appium:platformVersion': '14.0',
      'appium:deviceName': 'Google Pixel 7',
      'appium:automationName': 'UIAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'appium:autoGrantPermissions': true,
      'bstack:options': {
        projectName: 'CoMapeo',
        buildName: 'Parallel Android Build',
        sessionName: 'Pixel 7 - Android 14',
        appiumVersion: '2.12.1',
        debug: true,
        networkLogs: true,
        gpsLocation: '0.198214, 78.472225',
      },
    },
    {
      platformName: 'android',
      'appium:platformVersion': '9.0',
      'appium:deviceName': 'OnePlus 7',
      'appium:automationName': 'UIAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'appium:autoGrantPermissions': true,
      'bstack:options': {
        projectName: 'CoMapeo',
        buildName: 'Parallel Android Build',
        sessionName: 'OnePlus 7 - Android 9',
        appiumVersion: '2.12.1',
        debug: true,
        networkLogs: true,
        gpsLocation: '0.198214, 78.472225',
      },
    },
    {
      platformName: 'android',
      'appium:platformVersion': '10.0',
      'appium:deviceName': 'Xiaomi Redmi Note 9',
      'appium:automationName': 'UIAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'appium:autoGrantPermissions': true,
      'bstack:options': {
        projectName: 'CoMapeo',
        buildName: 'Parallel Android Build',
        sessionName: 'Redmi Note 9 - Android 10',
        appiumVersion: '2.12.1',
        networkLogs: true,
        gpsLocation: '0.198214, 78.472225',
      },
    },
    {
      platformName: 'android',
      'appium:platformVersion': '11.0',
      'appium:deviceName': 'Motorola Moto G71 5G',
      'appium:automationName': 'UIAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'appium:autoGrantPermissions': true,
      'bstack:options': {
        projectName: 'CoMapeo',
        buildName: 'Parallel Android Build',
        sessionName: 'Moto G71 - Android 11',
        appiumVersion: '2.12.1',
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
