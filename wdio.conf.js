// @ts-check

// `capabilities` missing in `Options.Testrunner` type: https://github.com/webdriverio/webdriverio/issues/13769
/** @type {import('@wdio/types').Options.Testrunner & { capabilities: import('@wdio/types').Capabilities }} */
const config = {
  runner: 'local',
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  specs: ['./tests/e2e/**/*.ts'],
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
        sessionName: 'Launch App and Grant Permissions',
        appiumVersion: '2.12.1',
        debug: true,
        networkLogs: true,
      },
    },
  ],
  logLevel: 'error',
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
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
