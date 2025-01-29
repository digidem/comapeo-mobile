export const config = {
  runner: 'local',
  user: process.env.BROWSERSTACK_USERNAME || 'your_browserstack_username',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'your_browserstack_access_key',
  hostname: 'hub.browserstack.com',
  specs: ['./tests/e2e/**/*.ts'],
  maxInstances: 1,
  services: [
    [
      'browserstack',
      {
        app: 'bs://47bee6ffa622788b17340af25cff598eb7fb132e',
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
      'appium:app': 'bs://47bee6ffa622788b17340af25cff598eb7fb132e',
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
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  reporters: ['spec'],
};
