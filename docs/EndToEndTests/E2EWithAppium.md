# End-to-End Testing with Appium + WebdriverIO

## Overview

We use [Appium](https://appium.io/) (with the UIAutomator2 driver on Android) and [WebdriverIO](https://webdriver.io/) to automate our end-to-end tests. Appium is the HTTP server handling communication with devices/emulators, and WebdriverIO is the Node.js testing framework that sends commands to Appium. We run it all on [Browserstack](https://www.browserstack.com/docs/app-automate/appium) because we have a free Device Cloud account.

## Prerequisites

- **UiAutomator2** installed `npx appium driver install uiautomator2`
- An Android emulator or device
- An `.env` file according to [.env.template](../../.env.template) at the root of the project. The `.env` file must have `MAPBOX_ACCESS_TOKEN`, `COMAPEO_METRICS_URL`, and `COMAPEO_METRICS_API_KEY`
- A `wdio.local.config` file according to [wdio.local.config.js.template](../../wdio.local.config.js.template]) at the root of the project
- (Optional) To use [BrowserStack](https://www.browserstack.com/), you must have an account

---

## Local Setup & Testing

1. **Start Appium Server**

   ```bash
   npx appium
   ```

2. **Get host name and port from appium terminal**
   - Appium will return a url with the following format `http://${hostName}:${port}/`.
   - For example: `http://127.0.0.1:4723/`, where `hostName===127.0.0.1` and `port===4723`

3. **Fill in host name and port in wdio config**
   - Updates the `wdio.local.config.js` to the hostName and port as determined in step above.

4. **Build App and Run Tests**

   ```bash
   npm run test:e2e:build
   ```

   You can skip the build step if the apk has already been built into the build folder:

   ```bash
   npm run test:e2e:nobuild
   ```

**Running e2e tests on a dev build**
E2e can be run on the expo dev build. The advantage to this is that any updates to the code means that the APK does not need to be rebuilt again, as those changes are automatically reflected in the dev build.

You can run e2e tests on this build by adding the following properties to your config:

```js
   capabilities: [
      {
         'appium:noReset':true,
         'appium:fullReset': false, // if set to true, it will uninstall the app before each test
         'appium:appPackage': 'com.comapeo.dev',
         'appium:appActivity': 'com.comapeo.dev.MainActivity'
         // remove appium:app
      },
   ],

```

One caveat is that e2e in CI rely on a fresh install of the app when running e2e test. Since the dev build may already have data, the tests may have different results when run on CI vs locally on a dev build. For example, all the tests in CI rely on the onboarding to set up the tests. If the dev build has already gone through the onboarding, those same tests will fail.

## Testing on BrowserStack (Locally)

1. **Upload the APK** to BrowserStack:

   ```bash
   curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
   -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
   -F "file=@/path/to/app-debug.apk"
   ```

   You’ll get an `app_url` (e.g. `bs://<some_id>`).

2. **Use the BrowserStack config** (example below).
   - The `services` block and `capabilities` define the device, OS version, etc.
   - Reference the `app_url` you got from the upload.

   ```js
   {
     user: process.env.BROWSERSTACK_USERNAME,
     key: process.env.BROWSERSTACK_ACCESS_KEY,
     hostname: 'hub.browserstack.com',
     specs: ['./tests/e2e/specs/flow.test.ts'],
     services: [
       [
         'browserstack',
         {
           app: process.env.BROWSERSTACK_APP_URL, // replace with your 'bs://
           browserstackLocal: true,
           testObservability: true,
           // ...
         },
       ],
     ],
     capabilities: [
       {
         platformName: 'android',
         'appium:platformVersion': '12.0',
         'appium:deviceName': 'Samsung Galaxy S22 Ultra',
         'appium:app': process.env.BROWSERSTACK_APP_URL, // replace with your 'bs://
         'bstack:options': {
           // ...
         },
       },
     ],
     // ...
   }
   ```

3. **Run**:
   ```bash
   BROWSERSTACK_APP_URL=bs://<some_id> \
   BROWSERSTACK_USERNAME=<user> \
   BROWSERSTACK_ACCESS_KEY=<key> \
   npm run test:e2e
   ```

---

## CI/CD Integration

- This is handled through the workflow file
  `.github/workflows/e2e-appium-browserstack.yml`

---

## Adding Tests

Tests are divided by feature. Each feature that is being tested has a folder in `tests/e2e/specs`. Tests should be able to run independently, and should require minimal interactions from other tests.

In CI, all tests are executed from a fresh install of the app, and require the onboarding flow to be completed. Use the tests from `tests/e2e/specs/onboarding/helper/minimal-onboarding-setup.test.ts` to run the onboarding to setup your tests.

Some tests also require a project to be initialized, run `tests/e2e/specs/solo-project/helper/minimal-project-creation.test.ts` before hand to initialize a project.

1. **Create a New Test Folder and Create Tests**
   - Create a folder, and add test files using the same style/pattern as existing specs.
   - Add an `index.test.ts`, which runs all the tests in the folder. The `minimal-onboarding-setup.test.ts` and `minimal-project-creation.test.ts` can be used in this file to setup the tests as needed.

2. **Add to config `specs`**
   - Our test runner executes all the files found in the config's `specs` array. Add the file path of your the test folder's `index.test.ts`

3. **Shared Utilities**
   - Any common functions or custom commands go in `tests/e2e/utils`.
   - Import them in your spec files as needed.

---

## Additional Notes

- **Test IDs**: Use unique test IDs in your React Native components for reliable selectors (e.g., `testID="ONBOARDING.device-name-inp"`).
- **Accessibility IDs** Add [`accessibilityLabel`](https://reactnative.dev/docs/accessibility) for the fastest, most reliable element selection in Appium.
- **Selector Strategies**: In WebdriverIO, you can use [`$(`android=...`)`](https://webdriver.io/docs/selectors#android-uiautomator) or standard Xpath/ID locators. From [Browserstack check out this page for guidelines](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio/local-testing)
- **Driver**: We rely on [UIAutomator2](https://github.com/appium/appium-uiautomator2-driver) for Android tests.
- **Logging**: For debugging, set `logLevel: 'trace'` and use `--log-level debug` when starting Appium.
- **MaxInstances**: in the config files, the maxInstances allows us to run several tests in parallel. When running locally, you should make sure `maxInstance` is set to 1 as you are only running on one device.

---

## Resources

- [Appium Official Docs](https://appium.io/docs/en/about-appium/intro/)
- [WebdriverIO Official Docs](https://webdriver.io/docs/gettingstarted)
- [BrowserStack App Automate](https://www.browserstack.com/docs/app-automate)
