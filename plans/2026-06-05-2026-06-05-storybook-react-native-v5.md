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

| Dependency                | Version                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| Expo SDK                  | 54 (`expo: 54.0.33`)                                                                             |
| React Native              | 0.81.6                                                                                           |
| React                     | 19.1.4                                                                                           |
| React Compiler            | enabled (`app.json:15`)                                                                          |
| Metro                     | 0.83.3                                                                                           |
| `@storybook/react-native` | **v10.4.4** (latest stable on npm as of 2026-06-05). Uses `@storybook/react` v10 under the hood. |
| Babel                     | `babel-preset-expo` + `react-native-reanimated/plugin` (must be last)                            |

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

`App.tsx` (at `src/frontend/App.tsx`) performs all initialization at module level:

1. Sentry init (`App.tsx:76-84`)
2. Creates all zustand stores (lines 95-161)
3. Creates `mapeoApi` via `createMapeoApi()` which sets up IPC to embedded Node.js backend (line 112)
4. Starts `localDiscoveryController` (line 122)
5. Calls `initializeNodejs()` which starts the embedded Node.js runtime (line 178)
6. Creates `queryClient` (line 210)

The `App` component render tree (lines 222-260):

```
Sentry.ErrorBoundary
  → LocaleContext + IntlProvider
    → Sentry.ErrorBoundary
      → ServerLoading (blocks until backend sends STARTED)
        → Suspense
          → AppProviders (15+ nested providers including ComapeoCoreProvider)
            → AppNavigator (line 249)
```

**Strategy: In-app conditional render (NOT entry-point swapping)**

The `@storybook/react-native` package offers two `withStorybook` wrappers:

1. **`@storybook/react-native/withStorybook`** (bundler-agnostic) — replaces the entry point entirely. Storybook gets a fresh `index.js`. The app's initialization (backend, stores, Sentry) never runs. This is the default/recommended approach for simple apps.

2. **`@storybook/react-native/metro/withStorybook`** (Metro-specific) — does NOT replace the entry point. It only stubs out `.rnstorybook` imports when `enabled: false`. The app's normal entry point runs, and Storybook is rendered conditionally inside the app. This is documented as "in-app integration."

**We use the Metro-specific wrapper** because CoMapeo's initialization chain is too complex to replicate in a standalone Storybook entry point. With this approach:

- The full app initialization runs (embedded Node.js backend starts, stores initialize, Sentry sets up)
- `App.tsx` conditionally renders `<StorybookUIRoot />` instead of `<AppNavigator>` at line 249
- Storybook renders **inside** `ServerLoading`, **inside** `AppProviders`, **inside** `IntlProvider`
- All contexts, stores, and the running backend are available to stories natively
- When `STORYBOOK_ENABLED=false`, the Metro wrapper stubs out the `.rnstorybook` import, so production builds contain zero Storybook code

### Environment Variable Handling

`babel.config.js:23` uses `transform-inline-environment-variables` with a specific `include` list (`MAPBOX_ACCESS_TOKEN`, `COMAPEO_METRICS_URL`, `COMAPEO_METRICS_API_KEY`). The `STORYBOOK_ENABLED` env var is NOT in this list, so it won't be inlined by Babel.

However, this is fine because:

- The Metro-specific `withStorybook` reads `STORYBOOK_ENABLED` at Metro config time (Node.js level), not at runtime
- The conditional in `App.tsx` can use `process.env.STORYBOOK_ENABLED` which Metro's bundler will evaluate at build time via dead-code elimination
- Alternatively, Expo's `EXPO_PUBLIC_*` env vars are automatically available via `app.config.js` `extra` field — but `STORYBOOK_ENABLED` doesn't need this treatment since it's only used in Metro config and a single conditional

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

**Since Storybook renders inside `AppProviders`**, all of these are already available. Stories don't need to provide any of these contexts.

**Additionally**, `App.tsx:224-225` provides `LocaleContext` + `IntlProvider` OUTSIDE `AppProviders`, so those are also available.

### Hardware-Bound Screens (Not Storybook-able)

- **CameraScreen** — wraps `react-native-vision-camera`
- **AudioRecording** — uses `expo-audio` recorder + `expo-keep-awake`
- **MapScreen** — deeply integrated with MapLibre native map rendering (could potentially have a placeholder story)

---

## Implementation Plan

### Phase 1: Storybook Infrastructure Setup

**Goal**: Get Storybook rendering inside the app on a device/emulator. Hard gate — do not proceed until a single placeholder story renders.

**Estimated time**: 1 day

- [ ] **1.1** Install dependencies as devDependencies:
  - `@storybook/react-native@10.4.4`
  - `@react-native-async-storage/async-storage` (required by Storybook's `getStorybookUI` for storage)
  - `storybook@^10.4.0` (peer dependency of `@storybook/react-native@10`)

  The project already has these as regular dependencies (no install needed):
  - `react-native-reanimated`, `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-svg`

- [ ] **1.2** Create `.rnstorybook/` directory with three files:
  - `.rnstorybook/main.ts` — story discovery glob pointing to `../src/frontend/**/*.stories.?(ts|tsx|js|jsx)`, empty `deviceAddons` array
  - `.rnstorybook/preview.tsx` — empty `Preview` with empty decorators and parameters
  - `.rnstorybook/index.tsx` — imports `view` from `./storybook.requires`, calls `view.getStorybookUI()` with AsyncStorage storage, exports the component as both default and named `StorybookUIRoot`

- [ ] **1.3** Add `"storybook-generate": "sb-rn-get-stories"` script to `package.json`. Run it to generate `.rnstorybook/storybook.requires.ts`. This file is auto-generated — add it to `.gitignore`.

- [ ] **1.4** Update `metro.config.js` to wrap the existing config with the **Metro-specific** `withStorybook`. This must be the Metro-specific import (`@storybook/react-native/metro/withStorybook`), NOT the bundler-agnostic one. Apply it as the outermost wrapper on the final config object:

  ```js
  const {
    withStorybook,
  } = require('@storybook/react-native/metro/withStorybook');

  // ... existing config setup (getSentryExpoConfig, SVG transformer, blockList, etc.) ...

  module.exports = withStorybook(config, {
    enabled: process.env.STORYBOOK_ENABLED === 'true',
  });
  ```

  Note: The `withStorybook` wrapper must receive the FINAL config object (after Sentry, SVG transformer, blockList, and `unstable_enablePackageExports` are applied). It wraps the entire thing.

- [ ] **1.5** Modify `src/frontend/App.tsx` to conditionally render Storybook instead of `AppNavigator`. Add the import at the top and modify line 249:

  ```tsx
  import StorybookUIRoot from '../.rnstorybook';

  // ... existing module-level code unchanged ...

  const isStorybook = process.env.STORYBOOK_ENABLED === 'true';

  // Inside the render (replace line 249):
  {
    isStorybook ? (
      <StorybookUIRoot />
    ) : (
      <AppNavigator
        permissionAsked={permissionsAsked}
        navigationIntegration={navigationIntegration}
      />
    );
  }
  ```

  The import path from `src/frontend/App.tsx` to `.rnstorybook/` is `../../.rnstorybook` — verify this at implementation time.

- [ ] **1.6** Add npm scripts to `package.json`:
  - `"storybook": "STORYBOOK_ENABLED=true npm run prestart && STORYBOOK_ENABLED=true expo start"`
  - `"storybook:android": "npm run build:backend && STORYBOOK_ENABLED=true expo run:android"`

- [ ] **1.7** Create a single placeholder story at `src/frontend/sharedComponents/Loading.stories.tsx` using CSF3 format:

  ```tsx
  import type {Meta, StoryObj} from '@storybook/react-native';
  import {Loading} from './Loading';

  const meta: Meta<typeof Loading> = {
    title: 'Shared/Loading',
    component: Loading,
  };
  export default meta;
  type Story = StoryObj<typeof Loading>;
  export const Basic: Story = {};
  ```

- [ ] **1.8** Build and run on a connected Android device or emulator: `npm run storybook:android`. Verify the Storybook UI renders with the placeholder story visible. **This is the hard gate** — resolve any Metro bundler conflicts, React Compiler errors, or native module issues before proceeding.

- [ ] **1.9** If React Compiler errors occur in Storybook files, add `"use no memo"` directive to `.rnstorybook/index.tsx` and any Storybook wrapper files. The compiler is enabled via `app.json:15` (`"reactCompiler": true`). If the compiler can be configured to exclude `.rnstorybook/` via babel or metro config, do that instead.

### Phase 2: Decorator Library

**Goal**: Build the reusable decorator infrastructure that all subsequent stories will use.

**Estimated time**: 1.5 days

- [ ] **2.1** Create `.rnstorybook/decorators/minimal.tsx` — a passthrough decorator that simply renders `<Story />`. With the in-app integration strategy, all base providers (`IntlProvider`, `SafeAreaProvider`, `GestureHandlerRootView`) are already available from `App.tsx` and `AppProviders`. This decorator exists for documentation — it marks stories that only need base React Native primitives. No wrapping needed.

- [ ] **2.2** Create `.rnstorybook/decorators/withNavigation.tsx` — wraps a single screen component in `NavigationContainer` + `NativeStack.Navigator` + `NativeStack.Screen`. Provides `useNavigation()`, `useRoute()`, `useFocusEffect()` context. Accepts initial route params via story parameters. This bypasses `RootStackNavigator` entirely (no auth checks, no device name checks, no `ActiveProjectProvider`). Use `@react-navigation/native-stack` (already a devDependency at v7.3.21) and `@react-navigation/native` (already a dependency at v7.2.2).

  **Important**: `RootStackNavigator` (at `src/frontend/Navigation/Stack/index.tsx:54-126`) conditionally renders screens based on auth state, device name, and project ID. It also wraps app screens in `ActiveProjectProvider` (line 79-82) which calls `useSingleProject({projectId})` from `@comapeo/core-react`. The `withNavigation` decorator bypasses all of this, so screens that depend on `ActiveProjectProvider` (most app screens) will need the `fullApp` decorator instead.

- [ ] **2.3** Create `.rnstorybook/decorators/fullApp.tsx` — a passthrough decorator that simply renders `<Story />`. With the in-app integration strategy, all app contexts (ComapeoCore, Location, LocalDiscovery, Auth, ActiveProject, etc.) are already available. This decorator exists for documentation — it marks stories that depend on the full app context. No wrapping needed.

- [ ] **2.4** Create `.rnstorybook/utils/seedData.ts` — helper functions to seed the running backend with test data via `@comapeo/core-react` hooks. Pattern from `src/frontend/screens/ComapeoSettings/CreateTestData.tsx:233-312`:
  - `useSeedObservations(count, options)` — creates N observations with random positions, using random presets. Returns a React Query mutation.
  - `useSeedProject(name)` — creates a project and sets it as active.
  - Each function uses `@comapeo/core-react` hooks (`useCreateDocument`, `useCreateProject`, `useClientApi`).
  - These are custom hooks meant to be used inside story `play` functions or inside wrapper components.

- [ ] **2.5** Register the `minimal` decorator as a global decorator in `.rnstorybook/preview.tsx` so all stories get it by default.

### Phase 3: Leaf Component Stories

**Goal**: Stories for all ~70 pure `sharedComponents` that need no special context beyond what's already provided by the app wrapper.

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

**Goal**: Lower complexity screens that mostly read from stores. Good proving ground for the `withNavigation` and `fullApp` decorators.

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

1. **`@storybook/react-native@10.4.4` compatibility with Expo 54 + RN 0.81 + React 19**
   - Risk: Storybook RN v10 lists `react-native@0.85.3` in its devDependencies and `react-native@>=0.72.0` as a peerDependency. RN 0.81.6 should be fine, but React 19.1.4 vs Storybook's dev React 19.2.3 is a minor mismatch. Expo 54 compatibility is untested.
   - Mitigation: Phase 1 task 1.8 is a hard gate. If incompatible, try: (a) check GitHub issues for Expo 54 compatibility, (b) try the latest patch version, (c) pin to a known-working version.

2. **Metro config conflicts**
   - Risk: The Metro-specific `withStorybook` wrapper may conflict with `getSentryExpoConfig`, SVG transformer, blockList, or `unstable_enablePackageExports`.
   - Mitigation: Apply `withStorybook` as the outermost wrapper on the final config. Test in Phase 1. If conflicts arise, inspect what `withStorybook` modifies and apply those changes manually.

3. **React Compiler errors**
   - Risk: `app.json:15` has `"reactCompiler": true`. Storybook files (`.rnstorybook/`) may trigger compiler errors because they use patterns the compiler doesn't support.
   - Mitigation: Add `"use no memo"` directives to Storybook files. If the compiler can be configured to exclude `.rnstorybook/` via babel or metro config, do that instead.

4. **Sentry noise in development**
   - Risk: Sentry reports errors from Storybook stories to `development` environment.
   - Mitigation: Already in `development` env (`appVariant.ts:9` checks for `.dev` suffix). Production unaffected. Filter in Sentry dashboard if noisy.

5. **Data persistence between stories**
   - Risk: All stories share the same running backend. Observations created in one story persist to the next.
   - Mitigation: Acceptable for visual development. Add cleanup only if it causes problems.

6. **`withNavigation` decorator limitations**
   - Risk: Screens with complex route params or `useFocusEffect` may not render correctly without the full navigation stack.
   - Mitigation: Provide initial params via the decorator. For complex cases, use `fullApp` decorator and navigate to the screen via the real `RootStackNavigator`.

7. **`babel.config.js` required env vars block Storybook startup**
   - Risk: `babel.config.js:3-13` asserts that `MAPBOX_ACCESS_TOKEN`, `COMAPEO_METRICS_URL`, and `COMAPEO_METRICS_API_KEY` are set. These are already required for the normal app, so this should be fine, but worth noting.
   - Mitigation: No action needed — these env vars are already required for all builds.

8. **Permissions dialog on first launch**
   - Risk: `App.tsx:215-219` requests camera and location permissions on mount. This fires even in Storybook mode.
   - Mitigation: One-time dialog on first launch. Not worth special handling.

---

## Effort Estimate Summary

| Phase                              | Scope                                             | Time     | Cumulative |
| ---------------------------------- | ------------------------------------------------- | -------- | ---------- |
| Phase 1: Infrastructure            | Install, Metro, App.tsx toggle, placeholder story | 1 day    | 1 day      |
| Phase 2: Decorators                | minimal + withNavigation + fullApp + seedData     | 1.5 days | 2.5 days   |
| Phase 3: Leaf Components           | ~70 pure components                               | 1.5 days | 4 days     |
| Phase 4: Context-Dependent         | 7 native-dep components                           | 0.5 day  | 4.5 days   |
| Phase 5: Settings & Onboarding     | ~20 screens                                       | 2 days   | 6.5 days   |
| Phase 6: Observations & Tracks     | ~20 screens                                       | 2 days   | 8.5 days   |
| Phase 7: Team, Project, Sync, Maps | ~40 screens                                       | 3 days   | 11.5 days  |
| Phase 8: Polish                    | Docs, CI, production verification                 | 0.5 day  | 12 days    |

**Total: ~12 working days** for full coverage.

**Minimum viable (Phase 1-3): ~4 days** for ~70 leaf component stories.

**Recommended first milestone (Phase 1-5): ~6.5 days** for all shared components + settings + onboarding screens.
