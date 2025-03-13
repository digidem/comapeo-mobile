# End-to-End Testing with Appium + WebdriverIO

## Overview

We use [Appium](https://appium.io/) (with the UIAutomator2 driver on Android) and [WebdriverIO](https://webdriver.io/) to automate our end-to-end tests. Appium is the HTTP server handling communication with devices/emulators, and WebdriverIO is the Node.js testing framework that sends commands to Appium. We run it all on [Browserstack](https://www.browserstack.com/docs/app-automate/appium) because we have a free Device Cloud account.

## Prerequisites

- **Appium** installed globally (`npm i -g appium`) or run via `npx appium`
- **UiAutomator2** installed `npx appium driver install uiautomator2`
- A running emulator or device
- (Optional) A [BrowserStack](https://www.browserstack.com/) account to test there

---

## Local Setup & Testing

1. **Build an APK**

   - `eas build --platform android --profile test --local --clear-cache`
   - Note the path to the `.apk` (build number, etc)

2. **Start the Emulator/ Device**

   - Get the device name with: `adb devices`.

3. **Start Appium Server** (in one terminal)

   ```bash
   appium --log-level debug
   ```

   or

   ```bash
   npx appium
   ```

4. **Run Tests** (in another terminal)
   - Update your `wdio.config.js` to run locally and point to the local `.apk`:
     ```js
     const config = {
     runner: 'local',
     specs: [path.resolve(__dirname, 'tests/e2e/specs/flow.test.ts')],
     maxInstances: 1,
      capabilities: [
      {
      platformName: 'Android',
      'appium:deviceName': 'emulator-5554', // Replace with your device name/ device ID (from adb devices)
      'appium:platformVersion': '13.0', // Replace with your platformVersion
      'appium:automationName': 'UIAutomator2',
      'appium:app': 'build-1741119529300.apk', // Replace with where/ what your apk is
      'appium:autoGrantPermissions': true,
      },
      ],
      hostname: '127.0.0.1', // Use local Appium (This is what it comes back for me when I start Appium... Just check this is how you see it)
      port: 4723, // see above
     ```

- Then run:
  ```bash
  npm run test:e2e
  ```

---

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

1. **Create a New Spec**

   - Add a new `.ts` file in `tests/e2e/specs`.
   - Create a folder for it if it makes sense.
   - Write your tests using the same style/pattern as existing specs. See guidelines below in Additional Notes.

2. **Reference in Flow**

   - Our test runner executes `flow.test.ts`, which imports other spec files in a specific sequence.
   - Update or reference your new spec in `flow.test.ts` so that it can be added to the order.

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

---

## Resources

- [Appium Official Docs](https://appium.io/docs/en/about-appium/intro/)
- [WebdriverIO Official Docs](https://webdriver.io/docs/gettingstarted)
- [BrowserStack App Automate](https://www.browserstack.com/docs/app-automate)
