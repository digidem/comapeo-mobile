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

- **Expo SDK**: 54 (`expo: 54.0.33`)
- **React Native**: 0.81.6
- **React**: 19.1.4
- **React Compiler**: enabled (`app.json:15` — `"reactCompiler": true`)
- **Metro**: 0.83.3
- **@storybook/react-native**: Latest is **v9.x** (NOT v8 as previously stated). Uses `.rnstorybook/` directory convention (not `storybook/`). Uses `withStorybook` Metro wrapper for entry-point swapping.
- **Metro config**: Uses `getSentryExpoConfig` from `@sentry/react-native/metro`, custom SVG transformer, blockList for android/ios/nodejs-assets, `unstable_enablePackageExports: true`

### Existing Test Infrastructure (Reusable)

The project already has battle-tested infrastructure in `tests/integration/helpers/` that is essentially Storybook decorators already written:

- **`tests/integration/helpers/core.ts:31-79`** — Creates a real `MapeoManager` with in-memory SQLite (`:memory:`) and RAM storage, sets up IPC via `MessageChannel`. This is a fully working backend that can seed test data.
- **`tests/integration/helpers/react.tsx:64-222`** — `createAppProvidersWrapper()` initializes all 15+ zustand stores, mocks `LocalDiscoveryController`, wraps with `AppProviders`.
- **`tests/integration/helpers/react.tsx:52-62`** — `createMinimalWrapper()` provides just `LocaleContext` + `IntlProvider` for leaf components.
- **`tests/integration/helpers/setupIntegrationTest.tsx:10-80`** — Complete render setup: creates manager, sets up IPC, creates a project, provides full wrapper with teardown.
- **`tests/integration/helpers/navigation.tsx:1-16`** — `MockedAppNavigator` renders the full `AppNavigator` without Sentry integration.
- **`jest.setup.js:98-118`** — Mocks for MapLibre (`MapView`, `Camera`, etc.) and VisionCamera that render as placeholder strings.
- **`src/frontend/screens/ComapeoSettings/CreateTestData.tsx:233-312`** — Already has `useCreateFakeObservationsMutation()` that creates test observations via `@comapeo/core-react` hooks. This pattern is directly reusable for Storybook seed data.

### Component Inventory

| Category            | Total Files                  | Files with Native Deps       | Pure (No Native Deps) |
| ------------------- | ---------------------------- | ---------------------------- | --------------------- |
| `sharedComponents/` | 77 (incl. icons, Touchables) | 7                            | 70                    |
| `screens/`          | ~140 unique screens          | 51 use `@comapeo/core-react` | ~89                   |

**7 native-dependent sharedComponents:**

- `PendingMapSharesListener.tsx` — `@comapeo/core-react`
- `PendingInvitesListener.tsx` — `@comapeo/core-react`
- `CoreBlobImage.tsx` — `@comapeo/core-react`
- `ProjectRemovalListener.tsx` — `@comapeo/core-react`
- `CameraView.tsx` — `react-native-vision-camera`
- `DrawerMenu.tsx` — `@comapeo/core-react`
- `ActionsRow/index.tsx` — `@comapeo/core-react`

### Architecture Note: How Storybook Fits into the App Boot Sequence

The app's initialization chain in `src/frontend/App.tsx` is:

1. **Module-level** (lines 76-178): Sentry init, store creation, `createMapeoApi()`, `initializeNodejs()` — all run before React renders
2. **`App` component** (lines 212-260): `PermissionsAndroid.requestMultiple`, then renders `<Sentry.ErrorBoundary>` → `<ServerLoading>` → `<AppProviders>` → `<AppNavigator>`
3. **`ServerLoading`** (lines 228): Blocks rendering until `ServerStateStore` is `STARTED`
4. **`AppNavigator`** (line 249): The navigation tree — **this is what Storybook replaces**

Storybook replaces `AppNavigator` at line 249, which is INSIDE `ServerLoading`, INSIDE `AppProviders`. This means:

- The embedded Node.js backend is already running and started
- All module-level stores are already initialized
- `ServerLoading` has already passed — the backend is ready
- `AppProviders` is already wrapping Storybook — all contexts (Location, LocalDiscovery, ComapeoCore, etc.) are available natively
- Sentry and PostHog are already initialized (PostHog is disabled for `development` builds per `src/frontend/lib/posthog.ts:14-16`; Sentry reports to `development` environment)

**Key implication**: Screen stories can use the app's existing `mapeoApi` and all providers directly. No need to create a separate backend instance.

### Storybook Metro Integration

`@storybook/react-native` v9+ uses the `withStorybook` Metro wrapper for **entry-point swapping** — it replaces the app's entry point with Storybook at the bundler level, controlled by the `STORYBOOK_ENABLED` env var. When disabled, Storybook code is completely excluded from the bundle.

```js
// metro.config.js
const {withStorybook} = require('@storybook/react-native/metro/withStorybook');
module.exports = withStorybook(config, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
});
```

This is cleaner than the env-var-in-App.tsx approach because:

- No Storybook code in production bundles (zero overhead)
- No conditional import in App.tsx
- Metro handles the swap at build time

### Context Provider Dependency Tree

From `src/frontend/contexts/AppProviders.tsx:96-146`, the full nesting order:

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

All of these are already available when Storybook renders (since it's inside `AppProviders`). Stories don't need to recreate this tree.

### @comapeo/core-react Hook Surface

30 different hooks used across 81 import sites in the frontend:

| Hook                                           | Import Sites | Purpose                                    |
| ---------------------------------------------- | ------------ | ------------------------------------------ |
| `useManyDocs`                                  | 8 files      | List observations, tracks, presets, alerts |
| `useOwnDeviceInfo`                             | 9 files      | Get device name, type                      |
| `useManyMembers`                               | 7 files      | List team members                          |
| `useProjectSettings`                           | 5 files      | Get project config                         |
| `useSingleDocByDocId`                          | 4 files      | Get single observation/track               |
| `useOwnRoleInProject`                          | 4 files      | Check user's role                          |
| `useUpdateProjectSettings`                     | 3 files      | Update project config                      |
| `useAttachmentUrl`                             | 3 files      | Get photo/audio URL                        |
| `useManyProjects`                              | 3 files      | List all projects                          |
| `useClientApi`                                 | 3 files      | Raw client access                          |
| `useCreateDocument`                            | 2 files      | Create observation/track                   |
| `useUpdateDocument`                            | 3 files      | Edit observation/track                     |
| `useDeleteDocument`                            | 2 files      | Delete observation/track                   |
| `useSetOwnDeviceInfo`                          | 2 files      | Set device name                            |
| `useSingleMember`                              | 2 files      | Get single member info                     |
| `useCreateProject`                             | 2 files      | Create new project                         |
| `useCreateBlob`                                | 1 file       | Upload media                               |
| `useMapStyleUrl`                               | 1 file       | Get map tile style URL                     |
| `useIconUrl`                                   | 1 file       | Get preset icon URL                        |
| `useSyncState`                                 | 1 file       | Sync progress                              |
| `usePresetsSelection`                          | 1 file       | Get filtered presets                       |
| `useManyInvites`                               | 1 file       | List pending invites                       |
| `useSendInvite` / `useRequestCancelInvite`     | 1 file       | Invite management                          |
| `useSendMapShare` / `useManyReceivedMapShares` | 3 files      | Map sharing                                |
| `useSingleSentMapShare`                        | 1 file       | Sent map share status                      |
| `useSingleReceivedMapShare`                    | 1 file       | Received map share status                  |
| `useAddServerPeer` / `useRemoveServerPeer`     | 2 files      | Remote archive                             |
| `useLeaveProject`                              | 1 file       | Leave project                              |
| `useRemoveMember`                              | 1 file       | Remove device                              |
| `useIsArchiveDevice` / `useSetIsArchiveDevice` | 1 file       | Archive device setting                     |
| `useImportProjectCategories`                   | 1 file       | Import categories                          |
| `useDocumentCreatedBy`                         | 2 files      | Document ownership                         |
| `useRemoveCustomMapFile`                       | 1 file       | Delete custom map                          |
| `useSingleProject`                             | 1 file       | Get active project API                     |

### Hardware-Bound Screens (Not Storybook-able)

These screens depend on hardware features that cannot be meaningfully visualized:

- **CameraScreen** (`src/frontend/screens/CameraScreen.tsx`) — wraps `react-native-vision-camera` CameraView
- **AudioRecording** (`src/frontend/screens/Audio/AudioRecording/index.tsx`) — uses `expo-audio` recorder + `expo-keep-awake`
- **MapScreen** (`src/frontend/screens/MapScreen/index.tsx`) — deeply integrated with MapLibre native map rendering, location tracking, and multiple map layers

These should be excluded from Storybook scope and tested on-device.

---

## Implementation Plan

### Phase 1: Storybook Infrastructure Setup

**Goal**: Get Storybook rendering inside the app on a device/emulator. Hard gate — do not proceed until a single placeholder story renders.

**Estimated time**: 1 day

- [ ] **1.1** Install `@storybook/react-native` (latest v9.x) as a devDependency. Do NOT install `@storybook/react-native-server` yet — it's deprecated in v9 in favor of the built-in web UI. Verify what companion tooling is available in the latest version.
- [ ] **1.2** Create `.rnstorybook/` directory with three files:
  - `.rnstorybook/main.ts` — configure story discovery glob (e.g., `'../src/frontend/**/*.stories.?(ts|tsx|js|jsx)'`)
  - `.rnstorybook/preview.tsx` — global decorators and parameters (start empty, add decorators in Phase 2)
  - `.rnstorybook/index.tsx` — entry point that renders `getStorybookUI()` from `view` import
- [ ] **1.3** Update `metro.config.js` to wrap the existing config with `withStorybook` from `@storybook/react-native/metro/withStorybook`. The wrapper must preserve the existing `getSentryExpoConfig`, SVG transformer, blockList, and `unstable_enablePackageExports` settings. Use `STORYBOOK_ENABLED` env var to toggle. The wrapper should wrap the final config object, not replace it.
- [ ] **1.4** Add npm scripts to `package.json`:
  - `"storybook": "STORYBOOK_ENABLED=true npm run prestart && STORYBOOK_ENABLED=true expo start"`
  - `"storybook:android": "STORYBOOK_ENABLED=true npm run build:backend && STORYBOOK_ENABLED=true expo run:android"`
- [ ] **1.5** Create a single placeholder story at `src/frontend/sharedComponents/Loading.stories.tsx` to verify the setup works. Use CSF3 format with `Meta` and `StoryObj` types from `@storybook/react-native`.
- [ ] **1.6** Build and run on a connected Android device or emulator: `npm run storybook:android`. Verify the Storybook UI renders with the placeholder story visible. **This is the hard gate** — resolve any Metro bundler conflicts, React Compiler errors, or native module issues before proceeding.
- [ ] **1.7** If React Compiler errors occur in Storybook files, add `"use no memo"` directive to `.rnstorybook/index.tsx` and any Storybook wrapper files, or configure the compiler to exclude `.rnstorybook/` directory.

### Phase 2: Decorator Library

**Goal**: Build the reusable decorator infrastructure that all subsequent stories will use.

**Estimated time**: 1.5 days

- [ ] **2.1** Create `.rnstorybook/decorators/minimal.tsx` — the base decorator for pure leaf components. Wraps stories with:
  - `LocaleContext` + `IntlProvider` (port from `tests/integration/helpers/react.tsx:52-62` `createMinimalWrapper()`)
  - Note: `SafeAreaProvider` and `GestureHandlerRootView` are NOT needed here because Storybook renders inside `AppProviders` which already provides them. Only add `IntlProvider` since `react-intl` `FormattedMessage` components need it.
- [ ] **2.2** Create `.rnstorybook/decorators/withNavigation.tsx` — wraps a single screen component in a `NavigationContainer` + `NativeStack.Navigator` + `NativeStack.Screen` containing just that screen. Provides `useNavigation()`, `useRoute()`, `useFocusEffect()` context. Accepts generic type params for the route name and initial params. This bypasses `RootStackNavigator` entirely — no conditional routing, no `ActiveProjectProvider` wrapper. Use `@react-navigation/native-stack` (already a devDependency).
- [ ] **2.3** Create `.rnstorybook/decorators/fullApp.tsx` — a passthrough decorator that simply renders `<Story />`. Since Storybook runs inside `AppProviders`, all contexts are already available. This decorator exists for documentation/clarity — it marks stories that depend on the full app context (Location, LocalDiscovery, ComapeoCore, Auth, etc.).
- [ ] **2.4** Create `.rnstorybook/utils/seedData.ts` — helper functions to seed the running backend with test data via `@comapeo/core-react` hooks. Pattern from `src/frontend/screens/ComapeoSettings/CreateTestData.tsx:233-312`. Functions:
  - `useSeedObservations(count, options)` — creates N observations with random positions near a given coordinate, using random presets. Returns a React Query mutation.
  - `useSeedProject(name)` — creates a project and sets it as active. Returns project ID.
  - `useSeedMembers(count)` — creates N team members (requires multiple devices, so this may be limited to the current device only).
  - Each function should be a custom hook that uses `@comapeo/core-react` hooks internally (`useCreateDocument`, `useCreateProject`, `useClientApi`, etc.).
- [ ] **2.5** Create `.rnstorybook/utils/playFunctions.ts` — Storybook `play` functions that call seed data helpers before the story renders. These run after the component mounts and can wait for data to be available. Example: `async function seedObservations(context) { ... }`.
- [ ] **2.6** Register the `minimal` decorator as a global decorator in `.rnstorybook/preview.tsx` so all stories get `IntlProvider` by default. Stories that need navigation context add `withNavigation` as a local decorator.

### Phase 3: Leaf Component Stories

**Goal**: Stories for all ~70 pure `sharedComponents` that need only the `minimal` decorator (IntlProvider). No native dependencies beyond React Native core.

**Estimated time**: 1.5 days

- [ ] **3.1** Button components: `Buttons.stories.tsx` (PrimaryButton, SecondaryButton, DestructiveButton, SecondaryDestructiveButton from `src/frontend/sharedComponents/Buttons.tsx`), `Button.stories.tsx`, `SaveButton.stories.tsx`, `TextButton.stories.tsx`, `IconButton.stories.tsx`
- [ ] **3.2** Input components: `Checkbox.stories.tsx`, `PasscodeInput.stories.tsx`, `HookFormTextInput.stories.tsx`, `Select.stories.tsx`, `SelectOne.stories.tsx`, `DescriptionField.stories.tsx`
- [ ] **3.3** Text/display components: `Text.stories.tsx` (HeaderText, BodyText), `Pill.stories.tsx`, `Divider.stories.tsx`, `FormattedData.stories.tsx`, `DateDistance.stories.tsx`, `IconTitleDescription.stories.tsx`, `ColorCard.stories.tsx`, `ProjectInfoCard.stories.tsx`
- [ ] **3.4** List/menu components: `List.stories.tsx` (List, ListItem, ListItemIcon, ListItemText), `MenuList.stories.tsx` (FullScreenMenuList, MenuListItem), `Accordian.stories.tsx`
- [ ] **3.5** Layout components: `BottomSheetWrapper.stories.tsx`, `ScreenContentWithDock.stories.tsx`, `HorizontalScrollView.stories.tsx`, `CustomHeaderLeft.stories.tsx`, `CustomHeaderLeftClose.stories.tsx`, `HeaderLeftClose.stories.tsx`
- [ ] **3.6** Status/feedback components: `Loading.stories.tsx`, `ErrorBottomSheet.stories.tsx`, `GPSPill.stories.tsx` (`GPSPillUI.tsx`), `RoleWithIcon.stories.tsx`, `DeviceNameWithIcon.stories.tsx`, `DeviceIcon.tsx`, `TrackStats.stories.tsx`, `LocationView.stories.tsx`
- [ ] **3.7** Storage/banner components: `LowStorageBanner.stories.tsx`, `MenuLowStorageAlert.stories.tsx`, `ExclamationBadge.stories.tsx`, `MetricsDiagnosticsPermissionToggle.stories.tsx`
- [ ] **3.8** Thumbnail/image components: `PhotoThumbnail.stories.tsx`, `AudioSavedThumbnail.stories.tsx`, `ThumbnailContainer.stories.tsx`, `ImageErrorPlaceholder.stories.tsx`, `TrulyContainedImage.stories.tsx`, `PhotoAttachmentView.stories.tsx`
- [ ] **3.9** Remaining pure components: `MapShareError.stories.tsx`, `MapShareCanceled.stories.tsx`, `MapPinErrorIcon.stories.tsx`, `PresetView.stories.tsx`, `HomeHeader.stories.tsx`, `KeyboardAccessory.stories.tsx`

### Phase 4: Context-Dependent Component Stories

**Goal**: Stories for the 7 sharedComponents that use `@comapeo/core-react` or other native modules.

**Estimated time**: 0.5 day

- [ ] **4.1** `CoreBlobImage.stories.tsx` — uses `fullApp` decorator. Seed test observations with photo attachments via `seedData.ts`. Show story with loaded image and story with loading state.
- [ ] **4.2** `PendingInvitesListener.stories.tsx` — uses `fullApp` decorator. Default state story (no pending invites).
- [ ] **4.3** `PendingMapSharesListener.stories.tsx` — uses `fullApp` decorator. Default state story.
- [ ] **4.4** `ProjectRemovalListener.stories.tsx` — uses `fullApp` decorator. Default state (not removed) story.
- [ ] **4.5** `CameraView.stories.tsx` — mark as "hardware-bound". Create a single story that renders a placeholder View noting this requires a physical device with camera.
- [ ] **4.6** `DrawerMenu.stories.tsx` — uses `fullApp` decorator (it uses `useManyProjects`). Show stories with 0 projects and 1 project.
- [ ] **4.7** `ActionsRow.stories.tsx` — uses `fullApp` decorator (it uses `@comapeo/core-react`). Show default state story.

### Phase 5: Screen Stories — Settings & Onboarding

**Goal**: First batch of screen stories. These are lower complexity — settings screens mostly read from stores, onboarding screens are mostly static UI. Good proving ground for the `withNavigation` + `fullApp` decorator combination.

**Estimated time**: 2 days

- [ ] **5.1** Settings screens:
  - `AppSettings.stories.tsx` (`src/frontend/screens/ComapeoSettings/index.tsx`)
  - `Security.stories.tsx` (`src/frontend/screens/ComapeoSettings/Security/index.tsx`)
  - `AppPasscode.stories.tsx` (index, SetPasscode, ConfirmPasscodeSheet, TurnOffPasscode, EnterPassToTurnOff)
  - `ObscurePasscode.stories.tsx`
  - `LanguageSettings.stories.tsx`
  - `CoordinateFormat.stories.tsx`
  - `UnitSystemSettings.stories.tsx`
  - `AboutSettings.stories.tsx`
  - `DataAndPrivacy.stories.tsx`
  - `DeviceNameDisplay.stories.tsx` / `DeviceNameEdit.stories.tsx`
  - `EarlyAccess.stories.tsx`
- [ ] **5.2** Onboarding screens:
  - `IntroToCoMapeo.stories.tsx`
  - `DeviceNaming.stories.tsx`
  - `DataPrivacy.stories.tsx`
  - `OnboardingPrivacyPolicy.stories.tsx`
  - `Success.stories.tsx`
  - `JoinProjectIntro.stories.tsx`
  - `MapOnYourOwnIntro.stories.tsx`
- [ ] **5.3** Auth screen:
  - `AuthScreen.stories.tsx` — test with `authState: 'unauthenticated'` and `authState: 'authenticated'` by setting SecurityStore state

### Phase 6: Screen Stories — Observations & Tracks

**Goal**: Data-heavy screen stories that require seeded observations and tracks. These exercise the `seedData.ts` utilities most heavily.

**Estimated time**: 2 days

- [ ] **6.1** Observation screens:
  - `ObservationsList.stories.tsx` — seed with 0, 1, and many observations
  - `Observation.stories.tsx` — seed with a single observation with attachments
  - `ObservationCreate.stories.tsx` — with and without draft observation
  - `ObservationEdit.stories.tsx` — with seeded observation
  - `ObservationFields.stories.tsx` — with seeded field definitions
  - `ObservationMetadata.stories.tsx` — with seeded observation
  - `ObservationCategoryChooser.stories.tsx` / `TrackCategoryChooser.stories.tsx` — with seeded presets
- [ ] **6.2** Track screens:
  - `Track.stories.tsx` — seed with a track with locations
  - `TrackEdit.stories.tsx`
  - `SaveTrack.stories.tsx`
  - `TrackRecordingActive.stories.tsx`
- [ ] **6.3** Observation/Track sub-screens:
  - `ManualGpsScreen.stories.tsx`
  - `LocationInfoScreen.stories.tsx`
  - `AddPhoto.stories.tsx`
  - `PhotoPreviewModal.stories.tsx` (DraftPhotoPreviewModal, AttachedPhotoPreviewModal)
  - `ConfirmDeletePhoto.stories.tsx`
  - `ExportObservations.stories.tsx` / `ExportSuccess.stories.tsx`

### Phase 7: Screen Stories — Team, Project, Sync, Maps

**Goal**: The most complex screen stories — team management, exchange/sync, background maps, remote archive. These involve the most `@comapeo/core-react` hooks and the most complex data states.

**Estimated time**: 3 days

- [ ] **7.1** Team/Project screens:
  - `YourTeam.stories.tsx` — seed with members
  - `SelectInviteDevice.stories.tsx`
  - `SelectInviteeRole.stories.tsx`
  - `ReviewAndInvite.stories.tsx`
  - `InviteAccepted.stories.tsx` / `InviteDeclined.stories.tsx`
  - `RemoveDevice.stories.tsx`
  - `CollaboratorInfo.stories.tsx`
  - `ProjectSettings.stories.tsx`
  - `EditProjectDetails.stories.tsx`
  - `ProjectCreation.stories.tsx` (CreateOrNameSoloProject, ProjectCreated)
  - `ProjectStatistics.stories.tsx`
  - `AllProjects.stories.tsx`
  - `ShareProjectStats.stories.tsx`
- [ ] **7.2** Exchange/Sync screens:
  - `Exchange.stories.tsx` — sync state depends on local peers being discovered
  - `ExchangeSettingsBottomSheet.stories.tsx`
- [ ] **7.3** Map/Background maps screens:
  - `BackgroundMaps.stories.tsx` — uses MapLibre which will render the actual map since it's running natively
  - `SendingBackgroundMap.stories.tsx` / `ReceivingBackgroundMap.stories.tsx`
  - `MapAddedBottomSheet.stories.tsx` / `MapReceivedBottomSheet.stories.tsx`
- [ ] **7.4** Remote archive screens:
  - `RemoteArchive.stories.tsx`
  - `AddRemoteArchive.stories.tsx` / `RemoveRemoteArchive.stories.tsx`
  - `SuccessfullyAddedArchive.stories.tsx`
- [ ] **7.5** Invite screens:
  - `InviteReceived.stories.tsx` / `InviteSuccessfullyAccepted.stories.tsx` / `InviteCanceled.stories.tsx`
  - `RemovedFromProjectBottomSheet.stories.tsx`
- [ ] **7.6** Other screens:
  - `PrivacyPolicy.stories.tsx`
  - `Categories.stories.tsx`
  - `AppUsagePromptInterstitial.stories.tsx` / `AppUsageSharingSuccess.stories.tsx`
  - Various bottom sheet stories (ConfirmDiscard*, ConfirmDelete*, DidNotMove\*, etc.)
  - `AudioAttachmentPlaybackScreen.stories.tsx` / `AudioDraftPlaybackScreen.stories.tsx`

### Phase 8: Polish & Maintenance Setup

**Goal**: Ensure Storybook is maintainable, documented, and production-safe.

**Estimated time**: 0.5 day

- [ ] **8.1** Verify production builds exclude Storybook code — run a production build without `STORYBOOK_ENABLED` and confirm no Storybook code is in the bundle. The `withStorybook` Metro wrapper should handle this, but verify.
- [ ] **8.2** Add a note to the project README (or existing dev docs) about how to run Storybook: `npm run storybook:android` and `npm run storybook`
- [ ] **8.3** Document the decorator hierarchy in `.rnstorybook/README.md`: which decorator to use for which type of component, how seed data works, how to add a new story.
- [ ] **8.4** Consider adding a CI check that runs Storybook build (not full app build, just the bundler) to catch broken stories. This can be a lint step that verifies all stories parse without errors.

---

## Verification Criteria

- [ ] `npm run storybook:android` launches the app with Storybook UI on a connected device/emulator
- [ ] All ~70 pure sharedComponents have stories that render without errors
- [ ] All 7 context-dependent sharedComponents have stories that render with the `fullApp` decorator
- [ ] At least 80% of screens (excluding hardware-bound Camera/AudioRecording/MapScreen) have at least one story rendering successfully
- [ ] Screen stories render using the app's running backend with seeded test data
- [ ] Storybook hot reload works — editing a component file updates the story in real-time
- [ ] Production builds (without `STORYBOOK_ENABLED`) do not include Storybook code in the bundle

---

## Potential Risks and Mitigations

1. **`@storybook/react-native` compatibility with Expo 54 + RN 0.81 + React 19**
   - Risk: Storybook RN v9 may not support this exact combination (Expo 54 is recent, React 19 is new).
   - Mitigation: Phase 1 task 1.6 is a hard gate. If `withStorybook` Metro wrapper doesn't work, try: (a) older Storybook version, (b) manual entry-point swapping (conditional export in `index.js`), (c) check Storybook RN GitHub issues for Expo 54 compatibility.

2. **Metro config conflicts**
   - Risk: `withStorybook` wrapper may conflict with `getSentryExpoConfig`, SVG transformer, blockList, or `unstable_enablePackageExports`.
   - Mitigation: The wrapper takes the final config and adds Storybook-specific settings on top. Test carefully in Phase 1. If conflicts arise, apply Storybook Metro settings manually instead of using the wrapper.

3. **React Compiler errors in Storybook files**
   - Risk: `app.json:15` has `"reactCompiler": true`. Storybook's wrapper components may not follow compiler rules, causing build errors.
   - Mitigation: Add `"use no memo"` directives to `.rnstorybook/` files. If the compiler can be configured to exclude directories, exclude `.rnstorybook/`.

4. **Sentry noise in development**
   - Risk: Sentry initializes at module level (`App.tsx:76`) and reports errors from Storybook stories to the `development` environment.
   - Mitigation: Already in `development` environment, so production is unaffected. If noise is problematic, add a `beforeSend` filter when `STORYBOOK_ENABLED` is true.

5. **Data persistence between stories**
   - Risk: Since all stories share the same running backend, observations created in one story's `play` function persist to the next story. Stories are not isolated.
   - Mitigation: This is actually acceptable for visual development — seeing accumulated data is fine. For true isolation, you'd need to delete created data in an `afterEach` cleanup, but this adds complexity. Start without isolation and add it only if it causes problems.

6. **`withNavigation` decorator limitations**
   - Risk: Screens that use `useFocusEffect`, complex route params, or deep linking may not render correctly with a minimal navigation wrapper.
   - Mitigation: The `withNavigation` decorator provides `NavigationContainer` + `NativeStack.Screen` with initial params. Most screens use `useNavigation()` and `useRoute()` which work with this setup. For screens that need the full navigation stack, use `MockedAppNavigator` from the test helpers.

7. **Story maintenance burden**
   - Risk: As the app evolves, stories break or drift from reality.
   - Mitigation: Start with Phase 3 leaf components (most stable) and expand gradually. The decorator approach means most changes to the app's context/provider architecture don't break stories.

---

## Alternative Approaches

1. **Web-based Storybook (`@storybook/react` + `react-native-web`)**: Would eliminate the need for a device/emulator but requires mocking all 30+ native modules and maintaining those mocks. The 110 files that import native modules make this approach extremely fragile and high-maintenance. Not recommended.

2. **Expo Dev Client with custom dev menu**: Instead of Storybook, add a custom dev menu screen that lets you navigate to any screen with mock data. Simpler to set up but lacks Storybook's organization, addon ecosystem (controls, actions, docs), and visual snapshot capabilities.

3. **Storybook only for `sharedComponents` (Phase 1-4 only)**: Ship only the ~77 shared component stories and skip screen-level stories entirely. Fastest path (~3 days) but provides limited value since most visual complexity is at the screen level.

---

## Effort Estimate Summary

| Phase                                      | Scope                                               | Estimated Time | Cumulative |
| ------------------------------------------ | --------------------------------------------------- | -------------- | ---------- |
| Phase 1: Infrastructure Setup              | Install, Metro config, placeholder story, hard gate | 1 day          | 1 day      |
| Phase 2: Decorator Library                 | minimal + withNavigation + fullApp + seedData       | 1.5 days       | 2.5 days   |
| Phase 3: Leaf Component Stories            | ~70 pure components                                 | 1.5 days       | 4 days     |
| Phase 4: Context-Dependent Stories         | 7 native-dep components                             | 0.5 day        | 4.5 days   |
| Phase 5: Settings & Onboarding Screens     | ~20 screens                                         | 2 days         | 6.5 days   |
| Phase 6: Observations & Tracks Screens     | ~20 screens + seed data                             | 2 days         | 8.5 days   |
| Phase 7: Team, Project, Sync, Maps Screens | ~40 screens                                         | 3 days         | 11.5 days  |
| Phase 8: Polish & Maintenance              | Docs, CI, production verification                   | 0.5 day        | 12 days    |

**Total: ~12 working days** for full coverage of all renderable UI elements.

**Minimum viable (Phase 1-3 only): ~4 days** for ~70 leaf component stories with hot reload on device.

**Recommended first milestone (Phase 1-5): ~6.5 days** for all shared components + settings + onboarding screens.
