# E2E on iOS

Status: **onboarding passes (19/19).** No other suite has been tried yet.

`E2E_IOS_ROADMAP.md` is Gregor's original document. Here is more that was learned after the fact.
See [What was learned](#what-was-learned) below.

---

## Run the tests locally

One time:

```sh
npx appium driver install xcuitest
cp wdio.ios.local.config.js.template wdio.ios.local.config.js
```

Fill in `deviceName`, `platformVersion` and `udid` from:

```sh
xcrun simctl list devices available
```

Build (only after changing app source — not for spec-only changes):

```sh
npm run build:ios:e2e        # ~5 min incremental
```

Run:

```sh
npx appium                   # terminal 1
npm run test:e2e:ios         # terminal 2
```

### Keep in mind

- **App source change → rebuild.** The JS bundle is baked into the `.app`.
  Spec-only changes need no rebuild.
- **Only run prebuild when you have to** (`app.config.js` or plugin changes).
  `npm run prebuild:ios:e2e` wipes `ios/` and forces a long full rebuild.
- **A different simulator:** `IOS_SIM_NAME="iPhone 16" npm run build:ios:e2e`
- **Two Appium servers can run at once** (`--port 4725`) if you want iOS and
  Android going in parallel.

---

## To do: get the other suites passing

Work top-down. Everything requires onboarding, which already passes.

### 1. Make each suite run at all

Enable one suite at a time in `wdio.ios.local.config.js` and see what breaks.
Suggested order — easiest first:

- [ ] tracks (2 active specs)
- [ ] menu
- [ ] solo-project
- [ ] multiple-projects
- [ ] exchange
- [ ] observations
- [ ] team
- [ ] audio
- [ ] settings
- [ ] passcode (hardest — leave for last)

### 2. Known blockers to expect

- [ ] **Screens collapse into one element on iOS.** A `TouchableOpacity` /
      `Pressable` wrapper hides every testID inside it. Fix: add
      `accessible={false}` to the wrapper.
- [ ] **Permissions:** mic (audio) and background location (tracks) go through
      an in-app sheet that `autoAcceptAlerts` does not cover. Needs a pre-grant
      or an explicit tap step.
- [ ] **Passcode uses Android key codes** (`pressKeyCode`, `isLocked`,
      `unlock`) that don't exist on iOS. The tests will need to be rewritten.

### 3. Cleanups worth doing anytime

- [ ] 4 `checkForElementGone` calls are missing `await`, so they assert
      nothing: `create-observation.test.ts:26`, `delete-observation.test.ts:39`,
      `audio-playback-delete.test.ts:12`, `project-retention.test.ts:69`.
- [ ] `set-passcode.test.ts:134` — `if (isDisplayed())` on `MAIN.map-screen` is
      always false on iOS, so that cleanup branch silently never runs.

---

## iOS on BrowserStack

The onboarding suite passes on a BrowserStack iPhone 17 (iOS 26), run from a
Mac with `wdio.ios.ci.config.js`.

### Run it

1. Build a signed device app (not a simulator build) from this branch. Use your
   own team ID (see `docs/iOSDeviceBuilds.md`):

   ```sh
   npm run prebuild:ios:e2e
   cd ios
   APP_VARIANT=releaseCandidate EXPO_PUBLIC_E2E_TEST=true xcodebuild \
     -workspace CoMapeoRC.xcworkspace -scheme CoMapeoRC -configuration Release \
     -destination 'generic/platform=iOS' -derivedDataPath ./build \
     -allowProvisioningUpdates DEVELOPMENT_TEAM=<YOUR_TEAM_ID> \
     CODE_SIGN_STYLE=Automatic build
   cd ..
   ```

2. Zip it into an `.ipa` and upload it. BrowserStack re-signs it, so a
   development-signed build is fine:

   ```sh
   mkdir -p /tmp/ipa/Payload
   cp -R ios/build/Build/Products/Release-iphoneos/CoMapeoRC.app /tmp/ipa/Payload/
   (cd /tmp/ipa && zip -qr CoMapeoRC.ipa Payload)
   curl -u "<user>:<key>" -X POST \
     "https://api-cloud.browserstack.com/app-automate/upload" \
     -F "file=@/tmp/ipa/CoMapeoRC.ipa" -F "custom_id=CoMapeo_iOS_branch"
   ```

3. Run it (reads the BrowserStack credentials from `.env`):

   ```sh
   set -a; source .env; set +a
   BROWSERSTACK_IOS_APP_URL=CoMapeo_iOS_branch npx wdio run wdio.ios.ci.config.js
   ```

### To do

- [ ] Enable the other suites in `wdio.ios.ci.config.js`, one at a time.
- [ ] **CI needs an `.ipa` built without a Mac**, i.e. EAS. The Apple
      credentials already exist: EAS has built signed release-candidate `.ipa`s
      since Sep 2026. But those use bundle id `app.comapeo.rc` (changed on
      `release/v14.x`), while develop still builds `com.comapeo.rc`. Merge
      that change back before trying `eas build --platform ios --profile test`.
- [ ] Specs hardcode `com.comapeo.rc` for `terminateApp`/`activateApp`
      (`obscure-mode`, `remote-archive`); iOS will need `app.comapeo.rc`.
- [ ] Add it to CI. Note the `browserstack-devices` concurrency group: iOS
      runs will compete with Android for the 5-session limit.

---

## What was learned

Things that cost time, so they don't cost it again.

**Build**

- Simulator builds must be **arm64 only**. `npm run build:ios:e2e` handles it.

**Writing specs**

- **`setValue` silently does nothing** on a just-rendered text box. Instead,
  use `setInputValue()` (`utils/input.ts`).
- **Never assert `toBeDisplayed()` on a full-screen container.** iOS reports it
  invisible because it has no tappable area of its own. `MAIN.map-screen` is
  like this. Use `waitForMapScreen()` (`utils/readiness.ts`).
  `.click()` on such a container _does_ work, so existing clicks are fine.
- **`driver.hideKeyboard()` throws on iOS.** Use `dismissKeyboard()`
  (`utils/touchActions.ts`).
- **Don't use `driver.pause()` to wait for something.** Wait for the thing
  itself. Pauses pass locally and fail on slower BrowserStack devices.
- **Verify shared helpers on both platforms.**
- **Use `.click()`, not `.tap()`.** On iOS, wdio's `.tap()` taps the
  element's top-left corner. With a `CONTAINS` selector that can be a large
  parent, whose corner is the back arrow.
- **Don't call `driver.releaseActions()`.** BrowserStack's iOS devices reject it
  ("unknown command").
- **Close the drawer with `$('~Close drawer').click()`**, the drawer's own
  overlay button. iOS hides everything behind an open drawer from
  accessibility, so tapping the map or list underneath only works on Android.
- **`autoAcceptAlerts` doesn't answer the location prompt on BrowserStack.**
  `waitForMapScreen()` taps the app's Allow button and then accepts the system
  prompt itself.

**Roadmap corrections** — these are listed as work but are already fine:

- `driver.back()` works on iOS.
- `MAIN.header-back-btn` works on iOS.
- The map-screen failures are not backend races; the map loads in under 5s.
- `DeviceNaming.tsx` is cited as a good example of `accessible={false}`. It
  wasn't — it was broken, and is now fixed.
