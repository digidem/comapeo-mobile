# Cross-Platform E2E iOS Migration Roadmap — comapeo-mobile

This consolidates the per-spec audit findings into an actionable roadmap for getting the e2e suites green on iOS (they were authored Android-only). It separates safe-to-apply trivial selector swaps from MAJOR work to track and skip for now. The app itself now runs on iOS (it boots, renders the map, and reports GPS); what remains is migrating the **e2e suites**, which has not been started — every item below still stands.

---

## 1. Trivial cross-platform selector fixes (SAFE to apply now)

These are the only items that require no judgment. The audit confirms the spec files themselves are almost entirely migrated to the platform-aware helpers (`byResourceId`/`byText`/`byTextMatches`) and `~accessibility-id` selectors. The single remaining hardcoded `android=` selector lives in one shared util.

- [ ] **`tests/e2e/utils/alerts.ts:3-4`** — `handleGPSAlert()` hardcodes `android=new UiSelector().text("SAVE").className("android.widget.Button")`. Replace the literal `android=` string with the platform-aware helper (`byText('SAVE')` / `byTextMatches('SAVE')`). This is the one true trivial-selector swap, and it is shared by the audio, observations, multiple-projects, solo-project, and passcode suites.
  - **Important caveat flagged by every spec that uses it:** swapping the selector does NOT make the helper *work* on iOS. The GPS/location prompt on iOS is a **native** `CLLocation`/`UIAlertController` (label `Save`, not uppercased `SAVE`, type `XCUIElementTypeButton`) — so it needs an `-ios predicate string` branch, OR it is handled by `autoAcceptAlerts:true` and the call becomes a harmless no-op. The selector swap is the safe mechanical part; the iOS behavior is a MAJOR item (see §2). Apply the swap, but do not assume it dismisses anything on iOS.

> Net: **exactly one** file:line trivial change exists across the entire audit (`alerts.ts:4`). Everything else flagged as "trivial-selector" in the source JSON was explicitly down-graded by the auditors to MAJOR because it requires platform branching, native-alert handling, or an app-source change.

---

## 2. MAJOR TODOs (SKIP for now — track these)

### A. `ios-a11y-collapse` — touchables swallow child testIDs/text on iOS

On iOS a touchable that is `accessible=true` (the default, or forced by an explicit `accessibilityLabel`) collapses its subtree into one element, hiding inner testIDs and text. General fix pattern: add `accessible={false}` to the wrapper (app-source change) or move the testID/select by the existing `accessibilityLabel`. (`src/frontend/screens/Onboarding/DeviceNaming.tsx` already applies this `accessible={false}` pattern and can serve as a reference.)

| Location (app source) | Consumed by (test) | What it breaks / change |
|---|---|---|
| `src/frontend/screens/ProjectCreation/CreateOrNameSoloProject/index.tsx:165` (TouchableWithoutFeedback, no `accessible={false}`) | multiple-projects `create-and-switch.test.ts:13-15`, `project-retention.test.ts:48-50`; solo-project `rename-project-from-drawer.test.ts:59,62,64` | Collapses `PROJECT.name-inp`, `PROJECT.create-btn`, `error-icon`. **Highest-leverage single fix** — add `accessible={false}`. |
| `src/frontend/sharedComponents/DrawerMenu.tsx:214,227,244,253,262` (TouchableOpacity items with explicit `accessibilityLabel`) | menu `universal-menu-test.test.ts:11-17,22-28,36-39,48-51,69,88`; `default-project.test.ts:28-29` | Inner BodyText (`Gather Observations`, `Background Map`, `CoMapeo Settings`, `Team`, `Coordinator Tools`) not exposed. Fix app-side OR rewrite tests to select by the existing `~Go to … screen.` labels. |
| `src/frontend/sharedComponents/Thumbnails/ThumbnailContainer.tsx:30-41` (TouchableOpacity, `accessibilityLabel="Play audio recording."`) | audio `audio-add-additional.test.ts:24,37,40,63-64` | Hides inner DateDistance text. Add `accessible={false}`, expose play action separately. |
| `src/frontend/screens/Exchange/ExchangeSettingsBottomSheet.tsx:127` (OptionCard Pressable) | exchange `everything.test.ts:18`, `previews.test.ts:17` | Hides `EXCHANGE.radio-selected-*` testIDs. Add `accessible={false}`. |
| `src/frontend/sharedComponents/GPSPill/GPSPillUI.tsx:109-136` + `GPSPill/index.tsx:16` (`accessibilityLabel="Open GPS Modal."`) | settings `unit-system.test.ts:36,75` | Inner `±N m`/`±N ft` text not queryable. Give inner BodyText its own testID. (The pill now renders a real value on iOS — `getLocationStatus` no longer requires the Android-only `gpsAvailable`, so it's no longer stuck on `--`; the a11y-collapse is the remaining blocker.) |
| `src/frontend/screens/Observation/index.tsx:111-126` (metadata TouchableOpacity) | observations `observation-metadata.test.ts:12-15`, `view-observations.test.ts:86-88` | Inner date text collapsed. Verify on-device; `accessible={false}` if needed. |
| `src/frontend/screens/YourTeam/TeamMemberCard.tsx:32` (bare TouchableOpacity) | team `team-screen-coordinator.test.ts:35-38`, `collaborator-info-coordinator.test.ts:16-17`, `leave-project-warning.test.ts:13-14` | Name + "This device" merge into one element; assertions fragile/false-pass. Add `accessible={false}`. |
| `src/frontend/sharedComponents/Accordian.tsx:30-37` (Pressable) + `src/frontend/screens/ObservationsList/TrackListItem.tsx:47` (TouchableOpacity) | tracks `view-edit-track.test.ts:10,16,22-24,53` (currently disabled) | Broad `byText('3')`/`byText('Track')` match merged labels. Add `accessible={false}` + tighten to stable testIDs. |
| `src/frontend/screens/PrivacyPolicy/index.tsx:37,58` (TouchableOpacity accordion headers); `Buttons.tsx` Primary/Secondary | onboarding `data-privacy.test.ts:17-18`, `privacy-policy.test.ts:24-31,45-53` | Tap still works via CONTAINS; flagged "verify on device, do NOT convert lookups to exact-match." Low priority. |

### B. `ios-keyboard` — software keyboard overlays buttons; `hideKeyboard()` unreliable

`driver.hideKeyboard()` is unreliable under XCUITest, and the numeric/standard keyboard overlays bottom-docked buttons. General fix: reliable dismissal (tap-outside, Return/Done key, scroll-into-view) — `tests/e2e/utils/touchActions.ts:tapAboveElement()` already exists for this and should be the standard path.

- **Onboarding device-name (gates audio, exchange, settings, team, solo-project, multiple-projects):** `tests/e2e/specs/onboarding/device-naming.test.ts:25,33,36` — `hideKeyboard().catch()` before `add-name-btn`. Failure here cascades into every dependent suite.
- **Passcode (worst keyboard case):** `PasscodeInput.tsx:90` uses `keyboardType='numeric'` → no Return/Done key, so `hideKeyboard()` cannot dismiss it; the numeric keypad overlays the `ScreenContentWithDock` bottom dock (`ScreenContentWithDock.tsx:28`, no scrollIntoView). Affects `set-passcode.test.ts:50-105`, `obscure-mode.test.ts:31,82`, `check-passcode-requirements.test.ts:55,117`, `post-passcode-setup.test.ts:90-95`. Needs accept-on-5th-digit / coordinate / app-side keyboardAvoiding fix.
- **Project-name Create button overlaid:** `create-and-switch.test.ts:13-15`, `project-retention.test.ts:48-50`, `rename-project-from-drawer.test.ts:65-66`.
- **Bottom tab bar overlaid after description setValue:** `project-retention.test.ts:23-30`, `edit-project-details.test.ts:24`.
- **Observations save/discard:** `add-details.test.ts:48-58`, `edit-observation.test.ts:63` (bare `hideKeyboard()` with no fallback → route through `tapAboveElement`), `create-observation.test.ts:73`, KeyboardAccessory `add-photo-btn-keyboard` (`create-observation.test.ts:73`, `edit-observation.test.ts:26-28` — also depends on simulator "Connect Hardware Keyboard" being off).
- **Settings edit-device-name:** `EditScreen.tsx:166` autoFocus raises keyboard; `edit-device-name.test.ts:19-22,36-38` never dismisses it.
- **Audio mic bottom-sheet detour** (`ActionsRow/index.tsx:57-64`) — see §E.

### C. `major-app-code` — app components that don't work on iOS

- **Deprecated `Button` uses Android-only `TouchableNativeFeedback`:** `src/frontend/sharedComponents/Button.tsx:5,87`, used by the Exchange "Change Settings" link (`ExchangeSettingsCard.tsx:45`), tapped by exchange `everything.test.ts:15`, `previews.test.ts:10`. On iOS press feedback degrades and taps can drop. Replace with cross-platform Primary/SecondaryButton (`Buttons.tsx`, TouchableOpacity).
- **react-navigation HeaderBackButton testID→accessibilityIdentifier unverified on iOS:** `src/frontend/sharedComponents/CustomHeaderLeft.tsx:29-31` (`MAIN.header-back-btn`), used by team `collaborator-info-coordinator.test.ts:39,42`, `leave-project-warning.test.ts:75,78`, `team-screen-coordinator.test.ts:64`. Native-stack headers may not forward testID. Verify; render explicit custom header-left if missing. (This testID is also the recommended replacement for `driver.back()` everywhere — so verifying it is a prerequisite for many §D fixes.)
- **Onboarding `driver.back()`** is also tagged major-app-code in the audio audit (`data-privacy.test.ts:31`) — see §D.

### D. `major-test-rewrite` — test logic that must be branched/rewritten

**`driver.back()` (Android hardware back, no iOS equivalent)** — replace with on-screen affordance (`byResourceId('MAIN.header-back-btn')` or a tab tap), branched on `driver.isIOS` where the screen is an overlay:
- onboarding `data-privacy.test.ts:31`, `privacy-policy.test.ts:57`
- observations `add-details.test.ts:96`
- multiple-projects `project-retention.test.ts:63,76`
- settings `edit-device-name.test.ts:55,56,65,66`
- solo-project `rename-project-from-drawer.test.ts:99`
- menu `universal-menu-test.test.ts:21` (drawer overlay — no nav-bar back, hardest), `:44,:59` (stack screens — likely partially work)

**Passcode — whole-spec Android-keyevent rewrite (largest single item):**
- `check-passcode-requirements.test.ts:9,11,14,15,39,41,44,45,59,62` built on `driver.pressKeyCode` (home=3, back=4, calendar=208, power=26) — none exist on iOS. Rewrite with `driver.background()`/`terminateApp`/`activateApp`; no power/lock concept on the simulator.
- `driver.isLocked()/unlock()` (`check-passcode-requirements.test.ts:64`, `obscure-mode.test.ts:26,76`) — Android keyguard only; guard with `isAndroid` or remove.
- `.click()+driver.keys()` typing into CodeField (`check-passcode-requirements.test.ts:20,54,74,116`, `obscure-mode.test.ts:30,81`) — depends on Android focus model; rework to `setValue` on the resource-id input or coordinate typing.

**Latent/no-op assertion bugs (platform-independent, surface as iOS flakiness):**
- `checkForElementGone` called WITHOUT `await` — passcode `obscure-mode.test.ts:71,87`. Fix: add `await`.
- `await expect(driver.isKeyboardShown())` with no matcher (no-op) — `set-passcode.test.ts:48`, `check-passcode-requirements.test.ts:34`, `post-passcode-setup.test.ts:24`. Fix: `expect(await driver.isKeyboardShown()).toBe(true)`.
- Audio thumbnail `byTextMatches('0[0-4]:[0-5][0-9]')` matches nothing on **either** platform (thumbnail renders DateDistance, not mm:ss) — `audio-add-additional.test.ts:24,37-38`. Drop the duration assertion or assert on the playback screen (`AudioDraftPlaybackScreen` mm:ss).

**`byTextMatches` regex misuse (iOS emits literal CONTAINS, not regex):**
- settings `unit-system.test.ts:36,42,43,75,81,82` — regexes like `'±\d+ ft'` never match on iOS. Query the GPS-pill by testID and assert with a JS regex instead. (The pill now renders a real `±N m`/`±N ft` value on iOS — previously it was stuck on the `--` error state with nothing to match — so this testID + JS-regex approach is now viable.)
- settings discard-alert case mismatch: `edit-device-name.test.ts:27,44` query `'DISCARD CHANGES'`/`'CONTINUE EDITING'` (Android uppercases; iOS `UIAlertController` preserves `Discard Changes`/`Continue Editing`, and iOS `byText` is case-sensitive). Use `byTextMatches` (case-insensitive) with the real case.

**Scroll helpers:**
- settings `language.test.ts:36-38` hardcoded `android=new UiScrollable(...).scrollIntoView(...)` — no iOS equivalent; rewrite to a cross-platform native scroll.
- settings `language.test.ts:28`, `about-comapeo.test.ts:15`, `early-access.test.ts:52,58` — `element.scrollIntoView()` is a web command, unreliable on XCUITest. Needs a platform-aware native scroll helper.

**Shared GPS-alert helper (the §1 caveat, as a rewrite):** `tests/e2e/utils/alerts.ts:3-11` needs an `-ios predicate` branch or removal-on-iOS (relying on `autoAcceptAlerts`). Confirm whether the iOS GPS prompt is native or RN. Affects audio, observations, multiple-projects, solo-project save flows.

**Weak negative assertion:** team `collaborator-info-coordinator.test.ts:34-35` asserts `not.toBeDisplayed()` on a never-rendered button (false-pass on both platforms). Assert screen state positively via stable testID.

### E. `backend-or-timing` — cold-restart races + permission gates

- **`terminateApp/activateApp('com.comapeo.rc')` + fixed `driver.pause(2000)` then immediate assert** — the `@comapeo/core-react-native` backend re-inits on cold start and can race the assert. Bundle id `com.comapeo.rc` is **confirmed correct on iOS** (`ios/CoMapeoRC.xcodeproj/project.pbxproj:492`, `wdio.ios.config.js:32`) — NOT a mismatch, purely timing. Replace fixed pauses with `waitUntil(MAIN.map-screen)` / readiness signal.
  - onboarding `map-on-your-own-intro.test.ts:49-54` (gates exchange, settings, team, solo-project, multiple-projects, audio)
  - passcode `obscure-mode.test.ts:24-27,74-77`, `check-passcode-requirements.test.ts:28-31,66-68` (also persisted security state must survive restart)
  - observations `restart-navigation.test.ts:8-9,22-23,36-37,78-79`
  - multiple-projects `project-retention.test.ts:51-62`; tracks `no-movement-track.test.ts:7-19`, `start-track.test.ts:5,11-20`
- **Mic-permission gate diverts to bottom sheet:** `src/frontend/sharedComponents/ActionsRow/index.tsx:57-64` — audio `audio-recording.test.ts:13-18`, `audio-add-additional.test.ts:11-15`. Pre-grant mic permission (`simctl privacy grant` / capabilities) or add an explicit bottom-sheet "allow" step. `autoAcceptAlerts` does not cover the in-app sheet.
- **Location permission pre-grant for tracks:** `start-track.test.ts` assumes pre-granted location; ensure `autoGrantPermissions`/iOS permissions cap. (Foreground location is now requested at app startup — `App.tsx` + `LocationContext` — and with `autoAcceptAlerts: true` in `wdio.ios.config.js` the iOS startup prompt is auto-accepted, so foreground is largely covered; background location for tracks still goes through the in-app sheet, see the mic/permission note above.)

---

## 3. Per-spec readiness table

| Spec | Trivial fixes | MAJOR TODOs | Verdict |
|---|---|---|---|
| **onboarding** | 0 | ~4 (2× `driver.back()`, device-name keyboard, restart race; + a11y verify) | **needs-work** — but it is the shared gate for almost every other suite, so fix first |
| **exchange** | 0 (specs clean) | 5 (radio a11y-collapse, Button/TouchableNativeFeedback, + inherited onboarding: back/keyboard/restart) | **needs-work** |
| **multiple-projects** | 1 (alerts.ts, shared) | 4 (CreateOrName a11y-collapse, 2× keyboard, `driver.back()` ×2, restart race) | **needs-work** |
| **observations** | 1 (alerts.ts, shared) | ~6 (`driver.back()`, keyboard ×3, a11y-collapse, restart race) | **needs-work** |
| **audio** | 1 (alerts.ts, shared) | 6 (thumbnail a11y-collapse, no-op duration assert, mic gate, GPS helper, + inherited onboarding back/keyboard) | **needs-work** |
| **settings** | 0 | ~8 (regex `byTextMatches` ×2, GPS-pill collapse, alert-case, `driver.back()`, autoFocus keyboard, UiScrollable, scrollIntoView ×4, restart) | **needs-work**, leaning blocked (most TODOs of any suite) |
| **solo-project** | 1 (alerts.ts, shared) | ~5 (CreateOrName a11y-collapse, GPS iOS branch, `driver.back()`, keyboard, restart) | **needs-work** |
| **team** | 0 (specs clean) | 5 (TeamMemberCard collapse, HeaderBackButton testID unverified, weak negative assert, + inherited onboarding keyboard/restart) | **needs-work** |
| **tracks** | 0 (active specs; alerts.ts not imported) | active suite: 2 (a11y-collapse on buttons, 2× backend/permission timing). Plus disabled `view-edit` has 3 more (stale testID, keyboard, broad-match) | **close** for the 2 active specs once onboarding + permissions land; `view-edit` blocked & disabled |
| **menu** | 0 | 3 (DrawerMenu collapse, `driver.back()` overlay-dismiss, `driver.back()` stack ×2) | **needs-work** — DrawerMenu fix unblocks most of it |
| **passcode** | 1 (alerts.ts GPS, but iOS no-op acceptable) | ~8 (full Android-keyevent rewrite, isLocked/unlock, numeric-keypad dismiss, dock overlay, keys() typing, restart race, 2× latent no-op asserts) | **blocked** — by far the most iOS-hostile; defer last |

---

## 4. Recommended order (least effort → unblock the most)

The suites form a dependency tree: almost everything `require()`s the onboarding chain (`device-naming` + `map-on-your-own-intro`), so fixing shared infra first turns many "blocked at setup" suites into "actually testable."

1. **Apply the one trivial fix** — `tests/e2e/utils/alerts.ts:4` android→helper swap (mechanical; do this now). Accept it is a no-op on iOS pending the §D iOS branch.

2. **Fix the shared onboarding gate** (unblocks audio, exchange, settings, team, solo-project, multiple-projects, tracks):
   - device-name keyboard dismissal → reliable iOS strategy via `tapAboveElement` (`device-naming.test.ts:25,33,36`).
   - replace `driver.back()` in `data-privacy.test.ts:31` / `privacy-policy.test.ts:57` with `MAIN.header-back-btn`.
   - replace `map-on-your-own-intro.test.ts:49-54` fixed pause with `waitUntil(MAIN.map-screen)`.
   - **Verify `CustomHeaderLeft.tsx` exposes `MAIN.header-back-btn` on iOS first** — every `driver.back()` rewrite depends on it.

3. **Land the high-leverage `accessible={false}` app-source fixes** (each unblocks a whole suite's core flow, low risk):
   - `CreateOrNameSoloProject/index.tsx:165` → unblocks multiple-projects + solo-project create/rename.
   - `DrawerMenu.tsx` items → unblocks menu.
   - `ExchangeSettingsBottomSheet.tsx:127` (+ replace deprecated `Button` in `ExchangeSettingsCard.tsx:45`) → unblocks exchange.
   - `ThumbnailContainer.tsx`, `TeamMemberCard.tsx:32`, `GPSPillUI.tsx`.

4. **Standardize keyboard + back handling across remaining specs** — route all `hideKeyboard()` through `tapAboveElement`; finish `driver.back()` → header-back rewrites (observations, multiple-projects, settings, menu).

5. **Replace all restart `driver.pause` with `waitUntil`** and add the mic/location permission pre-grants (audio, tracks). At this point tracks' 2 active specs should go green.

6. **Settings text-matching rewrites** — regex `byTextMatches`, alert-case, scroll helpers. Higher effort, isolated to settings.

7. **Passcode last** — full Android-keyevent rewrite, numeric-keypad dismissal, isLocked/unlock guarding, plus the latent `await`/`isKeyboardShown` fixes. Most iOS-hostile; do not let it block the others.

**Quick wins worth doing alongside step 1 (platform-independent correctness, no judgment risk):** add the missing `await` at `obscure-mode.test.ts:71,87`; fix the no-op `expect(driver.isKeyboardShown())` at `set-passcode.test.ts:48`, `check-passcode-requirements.test.ts:34`, `post-passcode-setup.test.ts:24`; drop/relocate the impossible audio duration assertion at `audio-add-additional.test.ts:24,37-38`.