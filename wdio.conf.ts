export const config = {
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
  logLevel: 'info',
  waitforTimeout: 20000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  reporters: [
    'spec',
    [
      'json',
      {
        outputDir: './test-results',
        fileName: 'wdio-log.json',
      },
    ],
    [
      'junit',
      {
        outputDir: './test-results',
        outputFileFormat: function (options) {
          return `wdio-results-${options.cid}.xml`;
        },
      },
    ],
  ],
};
