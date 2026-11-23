// @ts-check
const path = require('path');
const {browser} = require('@wdio/globals');
const shortSha = process.env.GITHUB_SHORT_SHA || 'manual';
const prTitle = process.env.GITHUB_PR_TITLE;
// The .ipa uploaded with custom_id=CoMapeo_iOS_branch; see docs/EndToEndTests/E2EiOS.md
const app = process.env.BROWSERSTACK_IOS_APP_URL || 'CoMapeo_iOS_branch';

/** @type {WebdriverIO.Config} */
const config = {
  runner: 'local',
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  specs: [
    path.resolve(__dirname, 'tests/e2e/specs/onboarding/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/tracks/index.test.ts'),
    path.resolve(__dirname, 'tests/e2e/specs/menu/index.test.ts'),
  ],
  maxInstances: 1,
  services: [
    [
      'browserstack',
      {
        app,
        testObservability: true,
        testObservabilityOptions: {
          projectName: 'CoMapeo iOS',
          buildName: `${prTitle || 'Manual Run'} – ${shortSha}`,
        },
      },
    ],
  ],
  capabilities: [
    {
      platformName: 'iOS',
      'appium:platformVersion': '26',
      'appium:deviceName': 'iPhone 17',
      'appium:automationName': 'XCUITest',
      'appium:app': app,
      'appium:autoAcceptAlerts': true,
      'appium:newCommandTimeout': 150,
      'bstack:options': {
        projectName: 'CoMapeo iOS',
        buildName: `${prTitle || 'Manual Run'} – ${shortSha}`,
        sessionName: `E2E iOS: ${shortSha}`,
        debug: true,
        networkLogs: true,
        gpsLocation: '0.198214, 78.472225',
        idleTimeout: 300,
      },
    },
  ],
  logLevel: 'error',
  waitforTimeout: 15000,
  connectionRetryTimeout: 240000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000,
  },
  reporters: [['spec', {addConsoleLogs: true}]],
  outputDir: './test-results',
  // The specs use `~label` for accessibilityLabel. On iOS `~` matches the
  // identifier, which is the testID when an element has one, so match either.
  before: () => {
    for (const command of /** @type {const} */ (['$', '$$'])) {
      browser.overwriteCommand(command, function (origCommand, selector) {
        if (typeof selector === 'string' && selector.startsWith('~')) {
          const value = selector.slice(1);
          return origCommand(
            `-ios predicate string:name == "${value}" OR label == "${value}"`,
          );
        }
        return origCommand(selector);
      });
    }
  },
};

module.exports = {config};
