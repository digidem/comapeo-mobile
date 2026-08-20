# Introduce @storybook/react-native for CoMapeo Mobile

## Objective

Set up `@storybook/react-native` (v8) to enable visual development and documentation of all UI elements in CoMapeo Mobile — from leaf shared components to full screen-level stories — running inside the actual native app so all native modules work without mocking.

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

These require a real native build. `@storybook/react-native` runs as a screen **inside** the native app, so all native modules work natively with zero mocking needed.

### Existing Test Infrastructure (Reusable)

The project already has battle-tested infrastructure in `tests/integration/helpers/` that is essentially Storybook decorators already written:

- **`tests/integration/helpers/core.ts:31-79`** — Creates a real `MapeoManager` with in-memory SQLite (`:memory:`) and RAM storage, sets up IPC via `MessageChannel`. This is a fully working backend that can seed test data.
- **`tests/integration/helpers/react.tsx:64-222`** — `createAppProvidersWrapper()` initializes all 15+ zustand stores, mocks `LocalDiscoveryController`, wraps with `AppProviders`.
- **`tests/integration/helpers/react.tsx:52-62`** — `createMinimalWrapper()` provides just `LocaleContext` + `IntlProvider` for leaf components.
- **`tests/integration/helpers/setupIntegrationTest.tsx:10-80`** — Complete render setup: creates manager, sets up IPC, creates a project, provides full wrapper with teardown.
- **`tests/integration/helpers/navigation.tsx:1-16`** — `MockedAppNavigator` renders the full `AppNavigator` without Sentry integration.
- **`jest.setup.js:98-118`** — Mocks for MapLibre (`MapView`, `Camera`, etc.) and VisionCamera that render as placeholder strings.

### Component Inventory

| Category            | Total Files | Files with Native Deps | Pure (No Native Deps) |
| ------------------- | ----------- | ---------------------- | --------------------- |
| `sharedComponents/` | 72          | 6                      | 66                    |
| `screens/`          | 179         | 64                     | 115                   |
| `hooks/server/`     | 11          | 11                     | 0                     |
| `contexts/`         | 30          | ~10                    | ~20                   |

**6 native-dependent sharedComponents:**

- `PendingMapSharesListener.tsx` — `@comapeo/core-react`
- `PendingInvitesListener.tsx` — `@comapeo/core-react`
- `CoreBlobImage.tsx` — `@comapeo/core-react`
- `ProjectRemovalListener.tsx` — `@comapeo/core-react`
- `CameraView.tsx` — `react-native-vision-camera`
- `DrawerMenu.tsx` — `@comapeo/core-react`

### Context Provider Dependency Tree

From `src/frontend/contexts/AppProviders.tsx:76-147`, the full nesting order:

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

**3 hard native dependency points in the provider tree:**

1. `LocationProvider` (`src/frontend/contexts/LocationContext.tsx:46-167`) — calls `expo-location`'s `watchPositionAsync`, `getForegroundPermissionsAsync`, `getProviderStatusAsync` on mount. Renders `<FatalError />` or `<Loading />` until resolved.
2. `LocalDiscoveryProvider` (`src/frontend/contexts/LocalDiscoveryContext.tsx:85-313`) — instantiates `Zeroconf` (native mDNS), calls `mapeoApi.startLocalPeerDiscoveryServer()`, manages `NetInfo` polling.
3. `ComapeoCoreProvider` (`@comapeo/core-react`) — root data layer providing ~30 hooks that communicate with the embedded Node.js backend via IPC.

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
- `AppProviders` is already wrapping Storybook — all contexts (Location, LocalDiscovery, ComapeoCore, etc.) are available
- Sentry and PostHog are already initialized (but in `development` environment, so PostHog is disabled and Sentry reports to dev environment)

**Key implication**: The `fullApp` decorator for screen stories doesn't need to create its own backend — it can use the app's existing `mapeoApi` and all providers. The `withStores` decorator is for cases where you want isolated/clean store state.

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

- **CameraScreen** (`src/frontend/screens/CameraScreen.tsx:1-38`) — wraps `react-native-vision-camera` CameraView
- **AudioRecording** (`src/frontend/screens/Audio/AudioRecording/index.tsx:1-185`) — uses `expo-audio` recorder + `expo-keep-awake`
- **MapScreen** (`src/frontend/screens/MapScreen/index.tsx:1-300`) — deeply integrated with MapLibre native map rendering, location tracking, and multiple map layers

These should be excluded from Storybook scope and tested on-device.

---

## Implementation Plan

### Phase 1: Infrastructure Setup (0.5 day)

- [ ] **1.1** Install `@storybook/react-native@8` and `@storybook/react-native-server@8` as devDependencies
- [ ] **1.2** Run `npx sb init` and configure for React Native + Expo
- [ ] **1.3** Create `storybook/main.ts` — configure Metro-based Storybook with the same Metro config the app uses
- [ ] **1.4** Create `storybook/preview.tsx` — set up global decorators and parameters
- [ ] **1.5** Create `storybook/Storybook.tsx` — entry point component that renders the Storybook UI
- [ ] **1.6** Add dev-only toggle to swap `AppNavigator` with `Storybook.tsx` in `src/frontend/App.tsx:249`. Use env var `EXPO_PUBLIC_STORYBOOK=true` or a hidden dev menu item. This avoids creating a separate build target.
- [ ] **1.7** Add `"storybook": "EXPO_PUBLIC_STORYBOOK=true expo start"` script to `package.json`
- [ ] **1.8** Set up `@storybook/react-native-server` — configure the web companion UI for browsing stories from a laptop while the app runs on device. Add `"storybook:server"` script to `package.json`.
- [ ] **1.9** Verify Storybook renders inside the app on a device/emulator with a single placeholder story. **This is a hard gate** — do not proceed to Phase 2+ until this works end-to-end.

### Phase 2: Decorator Library (1.5 days)

- [ ] **2.1** Create `storybook/decorators/minimal.tsx` — wraps stories with `LocaleContext` + `IntlProvider` + `SafeAreaProvider` + `GestureHandlerRootView`. Port `LocaleContext`/`IntlProvider` from `tests/integration/helpers/react.tsx:52-62` (`createMinimalWrapper()`). Add `SafeAreaProvider` and `GestureHandlerRootView` because many shared components use `TouchableOpacity` from gesture handler and safe area insets, and these native modules are available in the app. This is sufficient for all 66 pure sharedComponents.
- [ ] **2.2** Create `storybook/decorators/withStores.tsx` — wraps stories with all zustand stores (SecurityStore, CoordinateFormatStore, DraftObservationStore, TrackStore, ActiveProjectIdStore, MetricsDiagnosticsStore, SavedLocationStore, LowStorageBannerStore, AppUsageStatsStore, EarlyAccessStore, UnitSystemStore) initialized with sensible defaults. No backend needed — just store providers with default state. Port from `tests/integration/helpers/react.tsx:64-213` but replace `mapeoApi` with a no-op stub.
- [ ] **2.3** Create `storybook/decorators/withNavigation.tsx` — wraps a single screen in a `NavigationContainer` with a minimal stack navigator containing just that screen. Provides `useNavigation`, `useRoute`, `useFocusEffect` context. Use `@react-navigation/native-stack`. This bypasses `RootStackNavigator` entirely — no conditional routing, no `ActiveProjectProvider` wrapper.
- [ ] **2.4** Create `storybook/decorators/fullApp.tsx` — the full decorator using the app's existing providers. Since Storybook renders inside `AppProviders` (see Architecture Note above), this decorator can simply pass children through. For stories that need seeded data, use the `@comapeo/core-react` hooks directly within the story to create test observations, tracks, etc. via the real backend that's already running.
- [ ] **2.5** Create `storybook/decorators/mocks/location.ts` — mock `LocationProvider` that provides a static GPS coordinate (e.g., `-69.945, -4.231944` from `MapScreen`'s fallback) instead of calling `expo-location`. Useful for stories that need location context but aren't testing GPS behavior.
- [ ] **2.6** Create `storybook/decorators/mocks/localDiscovery.ts` — mock `LocalDiscoveryController` with static "connected" state. Port from `tests/integration/helpers/react.tsx:122-133`.
- [ ] **2.7** Create `storybook/decorators/mocks/mapLibre.tsx` — mock MapLibre components (`MapView`, `Camera`, `UserLocation`, `ShapeSource`, `LineLayer`) as simple `View` placeholders with test IDs. Port from `jest.setup.js:98-109`. Useful for stories that render map-containing screens without needing actual map tiles.
- [ ] **2.8** Create `storybook/utils/seedData.ts` — helper functions to seed the running backend with test data: create observations, tracks, presets, members, etc. Uses `@comapeo/core-react` hooks or direct `MapeoProjectApi` calls via `useClientApi`.

### Phase 3: Leaf Component Stories (1 day)

These 66 pure `sharedComponents` need only the `minimal` decorator (IntlProvider + SafeArea + GestureHandler). No native dependencies.

- [ ] **3.1** Create story files for button components: `Buttons.stories.tsx` (PrimaryButton, SecondaryButton, DestructiveButton, SecondaryDestructiveButton from `src/frontend/sharedComponents/Buttons.tsx`), `Button.stories.tsx` (from `src/frontend/sharedComponents/Button.tsx`), `SaveButton.stories.tsx`, `TextButton.stories.tsx`, `IconButton.stories.tsx`
- [ ] **3.2** Create story files for input components: `Checkbox.stories.tsx` (`src/frontend/sharedComponents/Checkbox.tsx`), `PasscodeInput.stories.tsx`, `HookFormTextInput.stories.tsx`, `Select.stories.tsx`, `SelectOne.stories.tsx`, `DescriptionField.stories.tsx`
- [ ] **3.3** Create story files for text/display components: `Text.stories.tsx` (HeaderText, BodyText from `src/frontend/sharedComponents/Text/`), `Pill.stories.tsx` (`src/frontend/sharedComponents/Pill.tsx`), `Divider.stories.tsx`, `FormattedData.stories.tsx`, `DateDistance.stories.tsx`, `IconTitleDescription.stories.tsx`, `ColorCard.stories.tsx`, `ProjectInfoCard.stories.tsx`
- [ ] **3.4** Create story files for list/menu components: `List.stories.tsx` (List, ListItem, ListItemIcon, ListItemText from `src/frontend/sharedComponents/List/`), `MenuList.stories.tsx` (FullScreenMenuList, MenuListItem), `Accordian.stories.tsx`
- [ ] **3.5** Create story files for layout components: `BottomSheetWrapper.stories.tsx`, `ScreenContentWithDock.stories.tsx`, `HorizontalScrollView.stories.tsx`, `CustomHeaderLeft.stories.tsx`, `CustomHeaderLeftClose.stories.tsx`, `HeaderLeftClose.stories.tsx`
- [ ] **3.6** Create story files for status/feedback components: `Loading.stories.tsx`, `ErrorBottomSheet.stories.tsx`, `GPSPill.stories.tsx` (`src/frontend/sharedComponents/GPSPill/GPSPillUI.tsx`), `RoleWithIcon.stories.tsx`, `DeviceNameWithIcon.stories.tsx`, `DeviceIcon.stories.tsx`, `TrackStats.stories.tsx`, `LocationView.stories.tsx`
- [ ] **3.7** Create story files for storage/banner components: `LowStorageBanner.stories.tsx`, `MenuLowStorageAlert.stories.tsx`, `ExclamationBadge.stories.tsx`, `MetricsDiagnosticsPermissionToggle.stories.tsx`
- [ ] **3.8** Create story files for thumbnail/image components: `PhotoThumbnail.stories.tsx`, `AudioSavedThumbnail.stories.tsx`, `ThumbnailContainer.stories.tsx`, `ImageErrorPlaceholder.stories.tsx`, `TrulyContainedImage.stories.tsx`, `PhotoAttachmentView.stories.tsx`
- [ ] **3.9** Create story files for remaining components: `MapShareError.stories.tsx`, `MapShareCanceled.stories.tsx`, `MapPinErrorIcon.stories.tsx`, `PresetView.stories.tsx`, `DrawerMenu.stories.tsx` (needs `withStores` decorator), `ActionsRow.stories.tsx`, `KeyboardAccessory.stories.tsx`

### Phase 4: Context-Dependent Component Stories (0.5 day)

These 6 sharedComponents use `@comapeo/core-react` and need the `withStores` or `fullApp` decorator.

- [ ] **4.1** `CoreBlobImage.stories.tsx` — needs `fullApp` decorator with seeded photo attachments to render. Use `seedData.ts` to create test observations with photo attachments.
- [ ] **4.2** `PendingInvitesListener.stories.tsx` — needs `fullApp` decorator. Story shows component with no pending invites (default state). Can add a story variant with mock invite data.
- [ ] **4.3** `PendingMapSharesListener.stories.tsx` — needs `fullApp` decorator. Similar to invites — default state story plus mock data variant.
- [ ] **4.4** `ProjectRemovalListener.stories.tsx` — needs `fullApp` decorator. Default state (not removed) story.
- [ ] **4.5** `CameraView.stories.tsx` — mark as "hardware-bound". Create a single story that renders a placeholder state noting this requires a physical device with camera. Do not attempt to mock the camera feed.
- [ ] **4.6** `DrawerMenu.stories.tsx` — needs `withStores` + mocked `useManyProjects` from `@comapeo/core-react`. Create stories with 0 projects, 1 project, and multiple projects.

### Phase 5: Screen Stories — Seeded Backend (4-5 days)

These screens use `@comapeo/core-react` hooks and need the `fullApp` decorator with the app's running backend + seeded test data. Each screen story needs: `fullApp` decorator + `withNavigation` decorator + seeded test data via `seedData.ts`.

Note: The time estimate accounts for creating meaningful seed data per screen — e.g., `ObservationCreate` needs a draft with preset + photos + GPS, `Exchange` needs local peers + sync state, `BackgroundMaps` needs map shares in various states.

- [ ] **5.1** Settings screens (lower complexity, good starting point):
  - `AppSettings.stories.tsx` (`src/frontend/screens/ComapeoSettings/index.tsx`)
  - `Security.stories.tsx` (`src/frontend/screens/ComapeoSettings/Security/index.tsx`)
  - `AppPasscode.stories.tsx` (`src/frontend/screens/ComapeoSettings/Security/AppPasscode/`)
  - `ObscurePasscode.stories.tsx`
  - `LanguageSettings.stories.tsx`
  - `CoordinateFormat.stories.tsx`
  - `UnitSystemSettings.stories.tsx`
  - `AboutSettings.stories.tsx`
  - `DataAndPrivacy.stories.tsx`
  - `DeviceNameDisplay.stories.tsx` / `DeviceNameEdit.stories.tsx`
  - `EarlyAccess.stories.tsx`
- [ ] **5.2** Observation screens:
  - `ObservationsList.stories.tsx` (`src/frontend/screens/ObservationsList/index.tsx`) — seed with 0, 1, and many observations
  - `Observation.stories.tsx` (`src/frontend/screens/Observation/index.tsx`) — seed with a single observation with attachments
  - `ObservationCreate.stories.tsx` — with and without draft observation
  - `ObservationEdit.stories.tsx` — with seeded observation
  - `ObservationFields.stories.tsx` — with seeded field definitions
  - `ObservationMetadata.stories.tsx`
  - `ObservationCategoryChooser.stories.tsx` / `TrackCategoryChooser.stories.tsx` — with seeded presets
- [ ] **5.3** Track screens:
  - `Track.stories.tsx` (`src/frontend/screens/Track/index.tsx`) — seed with a track with locations
  - `TrackEdit.stories.tsx`
  - `SaveTrack.stories.tsx`
  - `TrackRecordingActive.stories.tsx`
- [ ] **5.4** Team/Project screens:
  - `YourTeam.stories.tsx` (`src/frontend/screens/YourTeam/index.tsx`) — seed with members
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
- [ ] **5.5** Exchange/Sync screens:
  - `Exchange.stories.tsx` (`src/frontend/screens/Exchange/index.tsx`) — mock sync state
  - `ExchangeSettingsBottomSheet.stories.tsx`
- [ ] **5.6** Map/Background maps screens:
  - `BackgroundMaps.stories.tsx` — use MapLibre mock decorator
  - `SendingBackgroundMap.stories.tsx` / `ReceivingBackgroundMap.stories.tsx`
  - `MapAddedBottomSheet.stories.tsx` / `MapReceivedBottomSheet.stories.tsx`
- [ ] **5.7** Remote archive screens:
  - `RemoteArchive.stories.tsx`
  - `AddRemoteArchive.stories.tsx` / `RemoveRemoteArchive.stories.tsx`
  - `SuccessfullyAddedArchive.stories.tsx`
- [ ] **5.8** Onboarding screens:
  - `IntroToCoMapeo.stories.tsx`
  - `DeviceNaming.stories.tsx`
  - `DataPrivacy.stories.tsx`
  - `OnboardingPrivacyPolicy.stories.tsx`
  - `Success.stories.tsx`
  - `JoinProjectIntro.stories.tsx`
  - `MapOnYourOwnIntro.stories.tsx`
- [ ] **5.9** Other screens:
  - `ManualGpsScreen.stories.tsx`
  - `LocationInfoScreen.stories.tsx`
  - `PrivacyPolicy.stories.tsx`
  - `AllProjects.stories.tsx`
  - `ExportObservations.stories.tsx` / `ExportSuccess.stories.tsx`
  - `PhotoPreviewModal.stories.tsx` (DraftPhotoPreviewModal, AttachedPhotoPreviewModal)
  - `ConfirmDeletePhoto.stories.tsx`
  - `Categories.stories.tsx`
  - `AppUsagePromptInterstitial.stories.tsx` / `AppUsageSharingSuccess.stories.tsx`
  - `ShareProjectStats.stories.tsx`
  - `InviteReceived.stories.tsx` / `InviteSuccessfullyAccepted.stories.tsx` / `InviteCanceled.stories.tsx`
  - `RemovedFromProjectBottomSheet.stories.tsx`
  - Various bottom sheet stories (ConfirmDiscard*, ConfirmDelete*, DidNotMove\*, etc.)

### Phase 6: Navigation Flow Stories (1 day)

Multi-screen flow stories using `MockedAppNavigator` from `tests/integration/helpers/navigation.tsx`.

- [ ] **6.1** Create `storybook/flows/onboarding.stories.tsx` — full onboarding flow from IntroToCoMapeo through DeviceNaming to MapScreen
- [ ] **6.2** Create `storybook/flows/createObservation.stories.tsx` — flow from MapScreen → CategoryChooser → ObservationCreate → save
- [ ] **6.3** Create `storybook/flows/teamManagement.stories.tsx` — flow from YourTeam → SelectDevice → SelectRole → ReviewAndInvite → InviteAccepted
- [ ] **6.4** Create `storybook/flows/settings.stories.tsx` — flow through AppSettings → Security → AppPasscode → SetPasscode

### Phase 7: Documentation & Maintenance Setup (0.5 day)

- [ ] **7.1** Add `STORYBOOK.md` to the repo root with instructions for running Storybook, adding stories, and the decorator hierarchy
- [ ] **7.2** Add ESLint rule or CI check to ensure new `sharedComponents` have corresponding `.stories.tsx` files
- [ ] **7.3** Add Storybook entry to the app's dev menu (if one exists) or document the env var toggle
- [ ] **7.4** Ensure Storybook is excluded from production builds (verify the env var guard in App.tsx)

---

## Verification Criteria

- [ ] `EXPO_PUBLIC_STORYBOOK=true npx expo run:android` launches the app with Storybook UI instead of the normal app
- [ ] All 66 pure sharedComponents have stories that render without errors
- [ ] All 6 context-dependent sharedComponents have stories that render with appropriate decorators
- [ ] At least 80% of screens (excluding hardware-bound Camera/AudioRecording) have at least one story rendering successfully
- [ ] Screen stories with the `fullApp` decorator render using the app's running backend with seeded test data
- [ ] Storybook hot reload works — editing a component file updates the story in real-time
- [ ] Production builds (`APP_VARIANT=production`) do not include Storybook code
- [ ] Storybook UI is accessible via `@storybook/react-native-server` web interface for easier navigation

---

## Potential Risks and Mitigations

1. **`@storybook/react-native` v8 compatibility with current Expo SDK**
   - Risk: Storybook RN v8 may have unresolved issues with the project's Expo SDK version.
   - Mitigation: Test the init immediately in Phase 1 (task 1.9 is a hard gate). If incompatible, check for canary releases or pin to a known-working combination. The `@storybook/react-native` project actively maintains Expo compatibility.

2. **Metro bundler conflicts**
   - Risk: Storybook's Metro configuration may conflict with the project's existing `metro.config.js` (which has custom SVG transformer, Sentry config, and nodejs-mobile block list).
   - Mitigation: `@storybook/react-native` v8 uses the app's existing Metro config. No separate bundler needed. Verify early in Phase 1.

3. **`@comapeo/core-react` provider initialization time**
   - Risk: The `fullApp` decorator relies on the app's running backend. If the backend hasn't finished starting when a story renders, queries will hang.
   - Mitigation: Since Storybook replaces `AppNavigator` (which is inside `ServerLoading`), the backend is guaranteed to be started before Storybook renders. No race condition.

4. **Sentry noise in development**
   - Risk: Sentry initializes at module level (`App.tsx:76`) and reports errors from Storybook stories to the `development` environment. This could be noisy.
   - Mitigation: Sentry already uses `development` environment for dev builds, so production is unaffected. If noise is problematic, add a `beforeSend` hook that filters Storybook-related errors, or disable Sentry entirely when `EXPO_PUBLIC_STORYBOOK=true`.

5. **React Compiler compatibility**
   - Risk: The project has `"reactCompiler": true` enabled in `app.json:15`. Storybook's wrapper components may trigger compiler errors if they don't follow compiler rules.
   - Mitigation: Test early. If issues arise, add `"use no memo"` directives to Storybook wrapper files or exclude the `storybook/` directory from the compiler via config.

6. **MapLibre stories rendering blank**
   - Risk: Even with the mock decorator, screens that heavily depend on map state (zoom level, camera position, layer data) may look empty or broken.
   - Mitigation: Accept that map-heavy stories will show placeholder UI. Focus on the non-map UI elements within those screens. Consider adding a colored `View` as the map mock with a label "Map placeholder".

7. **Navigation mock complexity**
   - Risk: Screens that use `useFocusEffect`, `useRoute`, deep linking, or complex navigation params may not render correctly with a minimal navigation wrapper.
   - Mitigation: Use `MockedAppNavigator` (renders the full navigation stack) for flow stories. For individual screen stories, provide route params via the navigation decorator's initial params.

8. **Story maintenance burden**
   - Risk: As the app evolves, stories may break or become outdated. Without enforcement, stories drift from reality.
   - Mitigation: Start with a small set of critical stories in Phase 3 and expand gradually. Add CI checks in Phase 7. Consider generating basic stories automatically with a codemod.

9. **Permissions dialog on first launch**
   - Risk: `App.tsx:215-219` requests camera and location permissions on mount. This fires before Storybook renders and shows a system dialog on first launch.
   - Mitigation: This is a one-time annoyance that only happens on fresh installs. Accept it as-is — not worth special handling since it's the same behavior as the normal app.

---

## Alternative Approaches

1. **Web-based Storybook (`@storybook/react` + `react-native-web`)**: Would eliminate the need for a device/emulator but requires mocking all 30+ native modules and maintaining those mocks. The 110 files that import native modules make this approach extremely fragile and high-maintenance. Not recommended.

2. **Expo Dev Client with custom dev menu**: Instead of Storybook, add a custom dev menu screen that lets you navigate to any screen with mock data. Simpler to set up but lacks Storybook's organization, addon ecosystem (controls, actions, docs), and visual snapshot capabilities.

3. **Storybook only for `sharedComponents` (Phase 1-3 only)**: Ship only the 66 leaf component stories and skip screen-level stories entirely. Fastest path (2 days) but provides limited value since most visual complexity is at the screen level.

---

## Effort Estimate Summary

| Phase                                | Scope                                        | Estimated Time | Cumulative   |
| ------------------------------------ | -------------------------------------------- | -------------- | ------------ |
| Phase 1: Infrastructure Setup        | Install, configure, toggle, server companion | 0.5 day        | 0.5 day      |
| Phase 2: Decorator Library           | 4 decorators + 3 mock modules + seed data    | 1.5 days       | 2 days       |
| Phase 3: Leaf Component Stories      | 66 pure components                           | 1 day          | 3 days       |
| Phase 4: Context-Dependent Stories   | 6 native-dep components                      | 0.5 day        | 3.5 days     |
| Phase 5: Screen Stories              | ~80+ screen stories with seeded data         | 4-5 days       | 7.5-8.5 days |
| Phase 6: Navigation Flow Stories     | 4 multi-screen flows                         | 1 day          | 8.5-9.5 days |
| Phase 7: Documentation & Maintenance | Docs, CI, dev menu                           | 0.5 day        | 9-10 days    |

**Total: ~9-10 working days** for full coverage of all renderable UI elements.

**Minimum viable (Phase 1-3 only): ~3 days** for 66 leaf component stories with hot reload on device.
