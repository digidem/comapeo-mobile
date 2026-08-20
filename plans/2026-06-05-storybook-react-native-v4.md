# Introduce @storybook/react-native for CoMapeo Mobile

## Objective

Set up `@storybook/react-native` to enable visual development and documentation of all UI elements in CoMapeo Mobile — from leaf shared components to full screen-level stories — running inside the actual native app so all native modules work without mocking.

---

## Background & Research Summary

### Why Storybook (not Expo Go / web Storybook)

CoMapeo Mobile uses deeply integrated native modules that make web-based preview impossible:

- `@comapeo/nodejs-mobile-react-native` — embedded Node.js runtime for the backend
- `react-native-vision-camera` — hardware camera
- `@maplibre/maplibre-react-native` — native map rendering
- `react-native-mmkv` — native key-value storage
- `react-native-zeroconf` — mDNS peer discovery
- `react-native-reanimated` — native-driven animations

These require a real native build. `@storybook/react-native` runs as a component **inside** the native app, so all native modules work natively with zero mocking needed.

### Critical Version Information

| Dependency                | Version                                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Expo SDK                  | 54 (`expo: 54.0.33`)                                                                                                                                |
| React Native              | 0.81.6                                                                                                                                              |
| React                     | 19.1.4                                                                                                                                              |
| React Compiler            | enabled (`app.json:15`)                                                                                                                             |
| Metro                     | 0.83.3                                                                                                                                              |
| `@storybook/react-native` | Latest stable is **v8.x**. v10.x is in development on `next` branch but NOT yet published to npm as stable. Use the latest stable release from npm. |
| Babel                     | `babel-preset-expo` + `react-native-reanimated/plugin` (must be last)                                                                               |

### Existing Test Infrastructure (Reusable)

The project already has battle-tested infrastructure in `tests/integration/helpers/` that is essentially Storybook decorators already written:

- **`tests/integration/helpers/core.ts:31-79`** — Creates a real `MapeoManager` with in-memory SQLite (`:memory:`) and RAM storage, sets up IPC via `MessageChannel`.
- **`tests/integration/helpers/react.tsx:64-222`** — `createAppProvidersWrapper()` initializes all 15+ zustand stores, mocks `LocalDiscoveryController`, wraps with `AppProviders`.
- **`tests/integration/helpers/react.tsx:52-62`** — `createMinimalWrapper()` provides just `LocaleContext` + `IntlProvider` for leaf components.
- **`tests/integration/helpers/navigation.tsx:1-16`** — `MockedAppNavigator` renders the full `AppNavigator` without Sentry integration.
- **`jest.setup.js:98-118`** — Mocks for MapLibre (`MapView`, `Camera`, etc.) and VisionCamera that render as placeholder strings.
- **`src/frontend/screens/ComapeoSettings/CreateTestData.tsx:233-312`** — `useCreateFakeObservationsMutation()` already creates test observations via `@comapeo/core-react` hooks. This pattern is directly reusable for Storybook seed data.

### Component Inventory

| Category            | Total Files | Files with Native Deps       | Pure (No Native Deps) |
| ------------------- | ----------- | ---------------------------- | --------------------- |
| `sharedComponents/` | 77          | 7                            | 70                    |
| `screens/`          | ~140        | 51 use `@comapeo/core-react` | ~89                   |

**7 native-dependent sharedComponents:**

- `PendingMapSharesListener.tsx` — `@comapeo/core-react`
- `PendingInvitesListener.tsx` — `@comapeo/core-react`
- `CoreBlobImage.tsx` — `@comapeo/core-react`
- `ProjectRemovalListener.tsx` — `@comapeo/core-react`
- `CameraView.tsx` — `react-native-vision-camera`
- `DrawerMenu.tsx` — `@comapeo/core-react`
- `ActionsRow/index.tsx` — `@comapeo/core-react`

### Architecture: How Storybook Fits into the App

The app's entry point is `index.js`:

```js
import 'react-native-gesture-handler';
import './src/frontend/polyfills/intl';
import {registerRootComponent} from 'expo';
import App from './src/frontend/App';
registerRootComponent(App);
```

The `withStorybook` Metro wrapper replaces the entry point at the bundler level when `STORYBOOK_ENABLED=true`. Instead of `index.js`, Metro serves `.rnstorybook/index.tsx` as the entry. This means:

**Important**: The `withStorybook` entry-point swapping does NOT go through `App.tsx` at all. Storybook gets a completely fresh entry point. This means:

- The embedded Node.js backend is NOT started
- `AppProviders` is NOT rendered
- No contexts are available
- No Sentry, no stores, nothing

This is a critical architectural difference from what was previously planned. Storybook stories need to provide their own provider wrappers.

### Storybook Setup Convention

Based on the official `@storybook/react-native` docs:

1. **`.rnstorybook/`** directory with `main.ts`, `preview.tsx`, `index.tsx`
2. **`storybook.requires.ts`** is auto-generated by `sb-rn-get-stories` script
3. **`index.tsx`** imports from `./storybook.requires` and calls `view.getStorybookUI()`
4. **`main.ts`** defines story glob patterns and addons
5. **`preview.tsx`** defines global decorators and parameters
6. **Metro config** uses `withStorybook` wrapper with `enabled` flag

### Context Provider Dependency Tree

From `src/frontend/contexts/AppProviders.tsx:96-146`:

```
UnitSystemStoreContext                          ← zustand (pure JS)
  → MetricsDiagnosticsStoreProvider             ← zustand (pure JS)
    → AppUsageStatsProvider                     ← zustand (pure JS)
      → SecurityStoreProvider                   ← zustand (pure JS)
        → CoordinateFormatStoreProvider         ← zustand (pure JS)
          → ManualEntryCoordinateFormatStoreProvider ← zustand (pure JS)
            → TrackStoreProvider                ← zustand (pure JS)
              → QueryClientProvider             ← @tanstack/react-query (pure JS)
                → LowStorageBannerStoreProvider ← zustand (pure JS)
                  → SafeAreaProvider            ← react-native-safe-area-context (native)
                    → GestureHandlerRootView    ← react-native-gesture-handler (native)
                      → SavedLocationStoreProvider ← zustand (pure JS)
                        → LocationProvider      ← expo-location (NATIVE)
                          → LocalDiscoveryProvider ← react-native-zeroconf + @comapeo/ipc (NATIVE)
                            → ComapeoCoreProvider  ← @comapeo/core-react (NATIVE)
                              → ActiveProjectIdStoreProvider ← zustand (pure JS)
                                → DraftObservationProvider   ← zustand (pure JS)
                                  → EarlyAccessStoreProvider  ← zustand (pure JS)
                                    → AuthProvider            ← NativeModules.FlagSecureModule (NATIVE)
```

**For leaf component stories**: Only `IntlProvider` + `SafeAreaProvider` + `GestureHandlerRootView` are needed.

**For screen stories**: The full `AppProviders` wrapper is needed, which requires `mapeoApi` (from the embedded Node.js backend). This means screen stories must also start the embedded Node.js backend and wait for it to be ready.

### Two Integration Strategies

Given that `withStorybook` replaces the entire entry point:

**Strategy A: Entry-point swap (standalone Storybook)**

- Storybook gets its own entry point with no app initialization
- Stories must provide all their own providers
- For screen stories, must also start the embedded Node.js backend
- Pro: Clean separation, no app code leaks
- Con: Heavy setup for screen stories, must replicate app initialization

**Strategy B: In-app Storybook (conditional render)**

- Keep the app's normal entry point (`index.js` → `App.tsx`)
- In `App.tsx`, conditionally render Storybook UI instead of `AppNavigator`
- All app initialization runs normally (backend starts, providers mount)
- Storybook renders inside the existing provider tree
- Pro: Screen stories work immediately with real data, no setup
- Con: Storybook code is technically in the app (but gated by env var)

**Recommendation: Use Strategy B** (in-app conditional render). It's dramatically simpler for this project because:

1. The embedded Node.js backend initialization is complex and essential
2. The provider tree is deep and hard to replicate
3. Screen stories (the main value) would require full backend setup with Strategy A
4. The `withStorybook` Metro wrapper can still be used to strip Storybook code from production bundles

### Hardware-Bound Screens (Not Storybook-able)

- **CameraScreen** — wraps `react-native-vision-camera`
- **AudioRecording** — uses `expo-audio` recorder + `expo-keep-awake`
- **MapScreen** — deeply integrated with MapLibre native map rendering

---

## Implementation Plan

### Phase 1: Storybook Infrastructure Setup

**Goal**: Get Storybook rendering inside the app on a device/emulator. Hard gate — do not proceed until a single placeholder story renders.

**Estimated time**: 1 day

- [ ] **1.1** Install `@storybook/react-native` (latest stable from npm) and `@react-native-async-storage/async-storage` as devDependencies. Check npm for the actual latest stable version — do NOT assume v8 or v9 or v10. The project already has `react-native-reanimated`, `react-native-gesture-handler`, `react-native-svg`, and `react-native-safe-area-context` as dependencies, so those don't need installing.
- [ ] **1.2** Create `.rnstorybook/` directory with three files:
  - `.rnstorybook/main.ts` — story discovery glob pointing to `../src/frontend/**/*.stories.?(ts|tsx|js|jsx)`, empty `deviceAddons` array
  - `.rnstorybook/preview.tsx` — empty `Preview` with empty decorators and parameters
  - `.rnstorybook/index.tsx` — imports `view` from `./storybook.requires`, calls `view.getStorybookUI()` with AsyncStorage storage, exports the component
- [ ] **1.3** Add `"storybook-generate": "sb-rn-get-stories"` script to `package.json`. Run it to generate `.rnstorybook/storybook.requires.ts`.
- [ ] **1.4** Update `metro.config.js` to wrap the existing config with `withStorybook`. The wrapper must be applied AFTER `getSentryExpoConfig` and all other config (SVG transformer, blockList, `unstable_enablePackageExports`). Use `STORYBOOK_ENABLED` env var:
  ```js
  const {
    withStorybook,
  } = require('@storybook/react-native/metro/withStorybook');
  // ... existing config setup ...
  module.exports = withStorybook(config, {
    enabled: process.env.STORYBOOK_ENABLED === 'true',
  });
  ```
  If `withStorybook` is a default export (not named), adjust accordingly based on the installed version.
- [ ] **1.5** Modify `src/frontend/App.tsx` to conditionally render Storybook instead of `AppNavigator`. At line 249, replace `<AppNavigator>` with a conditional:
  ```tsx
  const isStorybook = process.env.STORYBOOK_ENABLED === 'true';
  // Inside the render:
  {isStorybook ? <StorybookUIRoot /> : <AppNavigator ... />}
  ```
  Import `StorybookUIRoot` from `../.rnstorybook` at the top of `App.tsx`. The `withStorybook` Metro wrapper will stub this import when `STORYBOOK_ENABLED=false`, so production builds are safe.
- [ ] **1.6** Add npm scripts to `package.json`:
  - `"storybook": "STORYBOOK_ENABLED=true npm run prestart && STORYBOOK_ENABLED=true expo start"`
  - `"storybook:android": "npm run build:backend && STORYBOOK_ENABLED=true expo run:android"`
- [ ] **1.7** Create a single placeholder story at `src/frontend/sharedComponents/Loading.stories.tsx` using CSF3 format with `Meta` and `StoryObj` types from `@storybook/react-native`. Import types from `@storybook/react-native` (or `@storybook/react` depending on the installed version).
- [ ] **1.8** Build and run on a connected Android device or emulator: `npm run storybook:android`. Verify the Storybook UI renders with the placeholder story visible. **This is the hard gate** — resolve any Metro bundler conflicts, React Compiler errors, or native module issues before proceeding.
- [ ] **1.9** If React Compiler errors occur in Storybook files, add `"use no memo"` directive to `.rnstorybook/index.tsx` and any Storybook wrapper files. If the compiler can be configured to exclude `.rnstorybook/`, do that instead.

### Phase 2: Decorator Library

**Goal**: Build the reusable decorator infrastructure that all subsequent stories will use.

**Estimated time**: 2 days

- [ ] **2.1** Create `.rnstorybook/decorators/minimal.tsx` — the base decorator for pure leaf components. Wraps stories with:
  - `LocaleContext` + `IntlProvider` (port from `tests/integration/helpers/react.tsx:52-62` `createMinimalWrapper()`)
  - `SafeAreaProvider` from `react-native-safe-area-context`
  - `GestureHandlerRootView` from `react-native-gesture-handler`

  Since Strategy B means Storybook renders inside `AppProviders`, these providers are technically already available. However, the `minimal` decorator is still useful for leaf component stories that might be tested in isolation (e.g., if someone later switches to Strategy A). For now with Strategy B, this decorator is a no-op passthrough that documents intent.

- [ ] **2.2** Create `.rnstorybook/decorators/withNavigation.tsx` — wraps a single screen component in `NavigationContainer` + `NativeStack.Navigator` + `NativeStack.Screen`. Provides `useNavigation()`, `useRoute()`, `useFocusEffect()` context. Accepts initial route params. This bypasses `RootStackNavigator` entirely. Use `@react-navigation/native-stack` (already a devDependency at v7.3.21) and `@react-navigation/native` (already a dependency at v7.2.2).

- [ ] **2.3** Create `.rnstorybook/decorators/fullApp.tsx` — a passthrough decorator that simply renders `<Story />`. With Strategy B, all app contexts are already available. This decorator exists for documentation — it marks stories that depend on the full app context (ComapeoCore, Location, LocalDiscovery, Auth, etc.).

- [ ] **2.4** Create `.rnstorybook/utils/seedData.ts` — helper functions to seed the running backend with test data via `@comapeo/core-react` hooks. Pattern from `src/frontend/screens/ComapeoSettings/CreateTestData.tsx:233-312`:
  - `useSeedObservations(count, options)` — creates N observations with random positions, using random presets. Returns a React Query mutation.
  - `useSeedProject(name)` — creates a project and sets it as active.
  - Each function uses `@comapeo/core-react` hooks (`useCreateDocument`, `useCreateProject`, `useClientApi`).
  - These are custom hooks meant to be used inside story `play` functions or inside wrapper components.

- [ ] **2.5** Register the `minimal` decorator as a global decorator in `.rnstorybook/preview.tsx` so all stories get the base provider wrapper by default.

### Phase 3: Leaf Component Stories

**Goal**: Stories for all ~70 pure `sharedComponents` that need only the `minimal` decorator.

**Estimated time**: 1.5 days

- [ ] **3.1** Button components: `Buttons.stories.tsx` (PrimaryButton, SecondaryButton, DestructiveButton, SecondaryDestructiveButton from `src/frontend/sharedComponents/Buttons.tsx`), `Button.stories.tsx`, `SaveButton.stories.tsx`, `TextButton.stories.tsx`, `IconButton.stories.tsx`
- [ ] **3.2** Input components: `Checkbox.stories.tsx`, `PasscodeInput.stories.tsx`, `HookFormTextInput.stories.tsx`, `Select.stories.tsx`, `SelectOne.stories.tsx`, `DescriptionField.stories.tsx`
- [ ] **3.3** Text/display components: `Text.stories.tsx` (HeaderText, BodyText), `Pill.stories.tsx`, `Divider.stories.tsx`, `FormattedData.stories.tsx`, `DateDistance.stories.tsx`, `IconTitleDescription.stories.tsx`, `ColorCard.stories.tsx`, `ProjectInfoCard.stories.tsx`
- [ ] **3.4** List/menu components: `List.stories.tsx` (List, ListItem, ListItemIcon, ListItemText), `MenuList.stories.tsx` (FullScreenMenuList, MenuListItem), `Accordian.stories.tsx`
- [ ] **3.5** Layout components: `BottomSheetWrapper.stories.tsx`, `ScreenContentWithDock.stories.tsx`, `HorizontalScrollView.stories.tsx`, `CustomHeaderLeft.stories.tsx`, `CustomHeaderLeftClose.stories.tsx`, `HeaderLeftClose.stories.tsx`
- [ ] **3.6** Status/feedback components: `Loading.stories.tsx`, `ErrorBottomSheet.stories.tsx`, `GPSPill.stories.tsx` (`GPSPillUI.tsx`), `RoleWithIcon.stories.tsx`, `DeviceNameWithIcon.stories.tsx`, `DeviceIcon.stories.tsx`, `TrackStats.stories.tsx`, `LocationView.stories.tsx`
- [ ] **3.7** Storage/banner components: `LowStorageBanner.stories.tsx`, `MenuLowStorageAlert.stories.tsx`, `ExclamationBadge.stories.tsx`, `MetricsDiagnosticsPermissionToggle.stories.tsx`
- [ ] **3.8** Thumbnail/image components: `PhotoThumbnail.stories.tsx`, `AudioSavedThumbnail.stories.tsx`, `ThumbnailContainer.stories.tsx`, `ImageErrorPlaceholder.stories.tsx`, `TrulyContainedImage.stories.tsx`, `PhotoAttachmentView.stories.tsx`
- [ ] **3.9** Remaining pure components: `MapShareError.stories.tsx`, `MapShareCanceled.stories.tsx`, `MapPinErrorIcon.stories.tsx`, `PresetView.stories.tsx`, `HomeHeader.stories.tsx`, `KeyboardAccessory.stories.tsx`

### Phase 4: Context-Dependent Component Stories

**Goal**: Stories for the 7 sharedComponents that use `@comapeo/core-react` or other native modules.

**Estimated time**: 0.5 day

- [ ] **4.1** `CoreBlobImage.stories.tsx` — uses `fullApp` decorator. Seed test observations with photo attachments.
- [ ] **4.2** `PendingInvitesListener.stories.tsx` — uses `fullApp` decorator. Default state story.
- [ ] **4.3** `PendingMapSharesListener.stories.tsx` — uses `fullApp` decorator. Default state story.
- [ ] **4.4** `ProjectRemovalListener.stories.tsx` — uses `fullApp` decorator. Default state story.
- [ ] **4.5** `CameraView.stories.tsx` — mark as "hardware-bound". Single placeholder story.
- [ ] **4.6** `DrawerMenu.stories.tsx` — uses `fullApp` decorator. Stories with 0 and 1 projects.
- [ ] **4.7** `ActionsRow.stories.tsx` — uses `fullApp` decorator. Default state story.

### Phase 5: Screen Stories — Settings & Onboarding

**Goal**: Lower complexity screens that mostly read from stores. Good proving ground.

**Estimated time**: 2 days

- [ ] **5.1** Settings screens: AppSettings, Security, AppPasscode (index, SetPasscode, ConfirmPasscodeSheet, TurnOffPasscode, EnterPassToTurnOff), ObscurePasscode, LanguageSettings, CoordinateFormat, UnitSystemSettings, AboutSettings, DataAndPrivacy, DeviceNameDisplay, DeviceNameEdit, EarlyAccess
- [ ] **5.2** Onboarding screens: IntroToCoMapeo, DeviceNaming, DataPrivacy, OnboardingPrivacyPolicy, Success, JoinProjectIntro, MapOnYourOwnIntro
- [ ] **5.3** Auth screen: AuthScreen with different auth states

### Phase 6: Screen Stories — Observations & Tracks

**Goal**: Data-heavy screens that exercise `seedData.ts` most heavily.

**Estimated time**: 2 days

- [ ] **6.1** Observation screens: ObservationsList (0, 1, many observations), Observation (with attachments), ObservationCreate (with/without draft), ObservationEdit, ObservationFields, ObservationMetadata, ObservationCategoryChooser, TrackCategoryChooser
- [ ] **6.2** Track screens: Track (with locations), TrackEdit, SaveTrack, TrackRecordingActive
- [ ] **6.3** Sub-screens: ManualGpsScreen, LocationInfoScreen, AddPhoto, PhotoPreviewModal, ConfirmDeletePhoto, ExportObservations, ExportSuccess

### Phase 7: Screen Stories — Team, Project, Sync, Maps

**Goal**: The most complex screen stories.

**Estimated time**: 3 days

- [ ] **7.1** Team/Project screens: YourTeam, SelectInviteDevice, SelectInviteeRole, ReviewAndInvite, InviteAccepted, InviteDeclined, RemoveDevice, CollaboratorInfo, ProjectSettings, EditProjectDetails, ProjectCreation, ProjectStatistics, AllProjects, ShareProjectStats
- [ ] **7.2** Exchange/Sync screens: Exchange, ExchangeSettingsBottomSheet
- [ ] **7.3** Map/Background maps screens: BackgroundMaps, SendingBackgroundMap, ReceivingBackgroundMap, MapAddedBottomSheet, MapReceivedBottomSheet
- [ ] **7.4** Remote archive screens: RemoteArchive, AddRemoteArchive, RemoveRemoteArchive, SuccessfullyAddedArchive
- [ ] **7.5** Invite screens: InviteReceived, InviteSuccessfullyAccepted, InviteCanceled, RemovedFromProjectBottomSheet
- [ ] **7.6** Other screens: PrivacyPolicy, Categories, AppUsagePromptInterstitial, AppUsageSharingSuccess, AudioAttachmentPlaybackScreen, AudioDraftPlaybackScreen, various bottom sheets

### Phase 8: Polish & Maintenance

**Goal**: Ensure Storybook is maintainable and production-safe.

**Estimated time**: 0.5 day

- [ ] **8.1** Verify production builds exclude Storybook — run `expo run:android` (without `STORYBOOK_ENABLED`) and confirm the app works normally with no Storybook code.
- [ ] **8.2** Add documentation to `.rnstorybook/README.md`: how to run Storybook, how to add stories, decorator hierarchy, seed data usage.
- [ ] **8.3** Consider adding a CI lint step that verifies all `.stories.tsx` files parse without errors (run `storybook-generate` and check exit code).

---

## Verification Criteria

- [ ] `npm run storybook:android` launches the app with Storybook UI on a connected device/emulator
- [ ] All ~70 pure sharedComponents have stories that render without errors
- [ ] All 7 context-dependent sharedComponents have stories that render
- [ ] At least 80% of screens (excluding hardware-bound Camera/AudioRecording/MapScreen) have at least one story
- [ ] Screen stories render using the app's running backend with seeded test data
- [ ] Storybook hot reload works — editing a component updates the story in real-time
- [ ] Production builds (without `STORYBOOK_ENABLED`) do not include Storybook code

---

## Potential Risks and Mitigations

1. **`@storybook/react-native` compatibility with Expo 54 + RN 0.81 + React 19**
   - Risk: The latest stable Storybook RN may not support this exact combination.
   - Mitigation: Phase 1 task 1.8 is a hard gate. If incompatible, try: (a) canary/pre-release version, (b) check GitHub issues for Expo 54 compatibility, (c) pin to the last known-working version.

2. **Metro config conflicts**
   - Risk: `withStorybook` wrapper may conflict with `getSentryExpoConfig`, SVG transformer, blockList, or `unstable_enablePackageExports`.
   - Mitigation: Apply `withStorybook` as the outermost wrapper on the final config. Test in Phase 1. If conflicts arise, apply Storybook Metro settings manually instead of using the wrapper.

3. **React Compiler errors**
   - Risk: `app.json:15` has `"reactCompiler": true`. Storybook files may trigger compiler errors.
   - Mitigation: Add `"use no memo"` directives. Exclude `.rnstorybook/` from compiler if possible.

4. **Sentry noise in development**
   - Risk: Sentry reports errors from Storybook stories to `development` environment.
   - Mitigation: Already in `development` env, production unaffected. Filter if noisy.

5. **Data persistence between stories**
   - Risk: All stories share the same running backend. Observations created in one story persist.
   - Mitigation: Acceptable for visual development. Add cleanup only if it causes problems.

6. **`withNavigation` decorator limitations**
   - Risk: Screens with complex route params or `useFocusEffect` may not render correctly.
   - Mitigation: Provide initial params via the decorator. For complex cases, use `MockedAppNavigator`.

---

## Effort Estimate Summary

| Phase                              | Scope                                             | Time     | Cumulative |
| ---------------------------------- | ------------------------------------------------- | -------- | ---------- |
| Phase 1: Infrastructure            | Install, Metro, App.tsx toggle, placeholder story | 1 day    | 1 day      |
| Phase 2: Decorators                | minimal + withNavigation + fullApp + seedData     | 2 days   | 3 days     |
| Phase 3: Leaf Components           | ~70 pure components                               | 1.5 days | 4.5 days   |
| Phase 4: Context-Dependent         | 7 native-dep components                           | 0.5 day  | 5 days     |
| Phase 5: Settings & Onboarding     | ~20 screens                                       | 2 days   | 7 days     |
| Phase 6: Observations & Tracks     | ~20 screens                                       | 2 days   | 9 days     |
| Phase 7: Team, Project, Sync, Maps | ~40 screens                                       | 3 days   | 12 days    |
| Phase 8: Polish                    | Docs, CI, production verification                 | 0.5 day  | 12.5 days  |

**Total: ~12.5 working days** for full coverage.

**Minimum viable (Phase 1-3): ~4.5 days** for ~70 leaf component stories.

**Recommended first milestone (Phase 1-5): ~7 days** for all shared components + settings + onboarding screens.
