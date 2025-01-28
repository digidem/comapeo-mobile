import {Options} from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  hostname: 'hub.browserstack.com',
  user: process.env.BROWSERSTACK_USERNAME || 'your_browserstack_username',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'your_browserstack_access_key',
  specs: ['./tests/e2e/**/*.ts'],
  maxInstances: 10,
  services: [
    [
      'browserstack',
      {
        app: 'bs://<app-id>',
        buildIdentifier:
          process.env.BUILD_NUMBER || `build-${new Date().toISOString()}`,
        browserstackLocal: true,
        capabilities: [
          {
            platformName: 'Android',
            'appium:deviceName': 'Samsung Galaxy S23 Ultra',
            'appium:platformVersion': '13.0',
            'appium:automationName': 'UiAutomator2',
            'appium:app': 'bs://<app-id>',
            'appium:autoGrantPermissions': true,
          },
        ],
      },
    ],
  ],
  logLevel: 'info',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  reporters: ['spec'],
};
