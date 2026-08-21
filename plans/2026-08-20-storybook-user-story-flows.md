# Storybook User-Story Flows

**Status**: Implementation and native acceptance complete. Two provenance-
recording, clean-cold, no-HMR 12-frame captures, reports, deterministic ledger
comparison, and leaf recovery passed on 2026-08-21. Current native
story-and-route markers were checked at screenshot time. Remaining:
whole-branch senior approval before committing. The map-server HMR lifecycle
defect remains a separate production/runtime issue; neither accepted cold run
reproduced it.
**Date**: 2026-08-20
**Branch**: `feat/storybook-integration`
**Extends**: [`plans/2026-06-05-2026-06-05-storybook-react-native-v6.md`](./2026-06-05-2026-06-05-storybook-react-native-v6.md)

---

## Objective

Make it possible to walk a **complete user journey** — first launch → onboarding → creating a first observation — entirely inside Storybook, and to **verify that journey renders correctly from a script**, without a human driving the real app.

Today's stories are isolated leaf components plus two ad-hoc screen stories. They prove that a `Button` renders; they do not prove that the onboarding sequence a new user sees actually works. This PRD adds the **flow/narrative layer**: a decorator that mounts the real navigator, a utility that makes the app's starting state deterministic, two concrete demonstration flows, and a permanent scripted-capture workflow.

This document deliberately does **not** re-scope Phases 5–7 of the master plan (the ~80 atomic per-screen stories). Those remain as written. This PRD covers only what sits on top of them, plus the handful of screens needed to demonstrate the flow layer end to end.

---

## Background & Research Summary

### What exists today

Verified in the repo on 2026-08-20:

| Area          | State                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storybook     | `@storybook/react-native@^10.4.4`, mounted in-app via `EXPO_PUBLIC_STORYBOOK_ENABLED=true` (`src/frontend/App.tsx`, `isStorybook` → `<StorybookRoot />` in place of `<AppNavigator>`) |
| Decorators    | `.rnstorybook/decorators/{minimal,withNavigation,fullApp}.tsx` — all built (Phase 2.1–2.3 done)                                                                                       |
| `seedData.ts` | `.rnstorybook/utils/seedData.ts` exists but is a **stub** (doc comment + `export {}`). Master-plan task **2.4 is not implemented**.                                                   |
| Stories       | ~30 leaf `sharedComponents` stories + `FatalError` / `FatalErrorUntranslated` screen stories. **Zero flow stories.**                                                                  |
| Capture       | Ad-hoc script at `/tmp/storybook-shots/capture_via_deeplink.sh`, not in the repo                                                                                                      |

The in-app mounting strategy from the master plan is the thing that makes this PRD cheap: stories already render inside the full real `AppProviders` tree, against the real running embedded backend. Nothing is mocked. See the master plan's "Architecture" and "Context Provider Dependency Tree" sections.

### Final App/Metro scope resolution

This flow PRD originally limited production-app changes to
`ActiveProjectIdStoreContext.tsx`, while the earlier master Storybook plan also
requires static integration in `src/frontend/App.tsx` plus Metro disabled-mode
stubbing. Clean normal-build correctness governs that conflict. `App.tsx` and
`metro.config.js` are therefore authorized Storybook integration scope:
`App.tsx` keeps the static `.rnstorybook` import and environment-selected root,
and Metro always calls `withStorybook`, using
`EXPO_PUBLIC_STORYBOOK_ENABLED` only for its `enabled` option. The disabled
wrapper stubs Storybook and `.rnstorybook`, so a normal production export does
not need the ignored generated `storybook.requires.ts`.

### Why `withNavigation` cannot deliver a user story

`.rnstorybook/decorators/withNavigation.tsx` registers exactly **one** screen:

```tsx
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="StoryScreen" component={Story} initialParams={params} .../>
  </Stack.Navigator>
</NavigationContainer>
```

That is correct for atomic per-screen QA and is what Phases 5–7 should keep using. But a "Next" button on such a story navigates nowhere — there is no second screen registered. A journey needs the **real** navigator.

### The real navigator

`src/frontend/AppNavigator.tsx` → `NavigationContainer` + `PostHogProvider` + `Suspense` + `RootStackNavigator`.

`src/frontend/Navigation/Stack/index.tsx` holds the real branching:

```ts
function getInitialRoute(authState, deviceName, projectId) {
  if (authState === 'unauthenticated') return 'AuthScreen';
  if (!deviceName) return 'IntroToCoMapeo';
  if (!projectId) return 'Success';
  return 'Home';
}
```

and picks the screen _set_ the same way: `AuthScreen` alone, else `createOnboardingScreens(...)`, else `createAppScreens(...)`.

Because Storybook replaces `<AppNavigator>` entirely, a story is free to mount `RootStackNavigator` itself. That yields the real, fully-connected, multi-screen flow for free — the exact navigation the shipping app uses.

### State sources that decide where a flow starts

Three inputs, three very different reset stories. All verified:

| Input             | Source                                                               | Set                                                                                                                    | Clear                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `authState`       | `useAuthContext()` ← `SecurityStoreContext`                          | `useSecurityActions().setPasscode(code)`                                                                               | `setPasscode(null)` → `authState` initialises to `'authenticated'`. **Easy.**                                                               |
| `deviceInfo.name` | `useOwnDeviceInfo()` ← real backend (`MapeoClientApi.getDeviceInfo`) | `useSetOwnDeviceInfo().mutate({name, deviceType})` — verified in `src/frontend/screens/Onboarding/DeviceNaming.tsx:58` | **No clear API.** The mutation's typed input is `{name: string; deviceType}`; core exposes `setDeviceInfo` only. See Open Question 1.       |
| `activeProjectId` | `useActiveProjectId()` ← `ActiveProjectIdStoreContext`               | `useActiveProjectIdActions().setActiveProjectId(id)`                                                                   | **No clear action exists** — `createActiveProjectIdStore` exposes only `setActiveProjectId`. Requires a small app-code addition (Task 2.2). |

Two non-obvious behaviours found while reading `src/frontend/contexts/ActiveProjectIdStoreContext.tsx`:

1. `ActiveProjectIdStoreProvider` runs a one-time init effect that calls `listProjects()` and **auto-selects `projects[0]`** if the store is empty. So "no active project" cannot be produced merely by wiping MMKV — the backend still has projects and the provider will re-adopt one.
2. That effect is guarded by `isInitialized` and runs **once per mount**. The provider mounts once, above Storybook. Therefore a _post-mount_ clear of the store sticks for the rest of the session. This is what makes a runtime flow-state reset viable at all.

### Splash

There is no splash React component to story. `src/frontend/ServerLoading.tsx` returns `null` while the backend is `STARTING` — the visible splash is the native Expo splash _image asset_ behind that blank frame. By the time Storybook mounts, `ServerLoading` has already resolved (`StorybookRoot` even calls `SplashScreen.hideAsync()` on mount, precisely because the Storybook branch bypasses `AppNavigator`'s splash-hide). **Decision: no live splash story.** See Task 3.4.

### Capture mechanism (already proven)

An explicit-component Android intent delivered to the already-running Storybook activity, carrying `STORYBOOK_STORY_ID`, which RN Storybook's own `Linking` listener forwards to `SET_CURRENT_STORY`:

```bash
adb shell am start -n com.comapeo.dev/.MainActivity -a android.intent.action.VIEW \
  -d "storybook://x?STORYBOOK_STORY_ID=<story-id>"
sleep 2 && adb shell screencap -p /sdcard/shot.png && adb pull /sdcard/shot.png <out.png>
```

No `scheme` in `app.json` is needed — explicit-component intents bypass intent-filter matching. Verified reliable across all 30 current stories with zero blanks or crashes, after two prior approaches (force-stop + restart per story; same with longer sleeps) proved racy. This is the mechanism the whole "verify without loading the app" promise rests on, and it needs to become a repo artifact rather than a `/tmp` script.

---

## Architecture

### Three decorators, three jobs

| Decorator                       | Mounts                                           | Use for                           |
| ------------------------------- | ------------------------------------------------ | --------------------------------- |
| `minimal` / `fullApp`           | `<Story />` (passthrough)                        | Leaf components (Phases 3–4)      |
| `withNavigation`                | One isolated screen in its own `Stack.Navigator` | Atomic per-screen QA (Phases 5–7) |
| **`withRealNavigator`** _(new)_ | The real `RootStackNavigator`                    | **Flow stories only**             |

### `withRealNavigator`

```tsx
// .rnstorybook/decorators/withRealNavigator.tsx  (shape, not final code)
export const withRealNavigator: Decorator = (Story, context) => {
  const spec = context.parameters?.flow?.state; // FlowStateSpec
  const seed = context.parameters?.flow?.initialState; // NavigationState | undefined
  const ready = useFlowState(spec); // applies + reports readiness

  if (!ready) return <FlowStatePlaceholder />;

  return (
    <NavigationContainer key={`${context.id}:${ready.key}`} initialState={seed}>
      <RootStackNavigator />
    </NavigationContainer>
  );
};
```

Four decisions embedded here, each load-bearing:

**1. Mount `RootStackNavigator`, not `AppNavigator`.** `AppNavigator` additionally wires `PostHogProvider` screen-tracking and calls `SplashScreen.hide()`. Neither belongs in a story: the first pollutes analytics with synthetic screen views, the second is a side effect `StorybookRoot` already handles. Re-implementing the two lines `AppNavigator` actually contributes (`NavigationContainer` + `Suspense`) is cheaper than suppressing what it drags along.

**2. The `Story` component is ignored for flow stories.** A flow story's "component" is the journey, not a React element. The story function should render `null` (or a one-line legend); everything visible comes from the decorator. This is a departure from normal Storybook shape and must be documented so the pattern is not cargo-culted onto per-screen stories.

**3. A story-and-state key forces a remount after state changes.** `getInitialRoute()` and the screen-set branch are evaluated **at mount**. Setting a device name after the navigator has mounted will not move it to `Success`. The decorator must therefore apply the flow state first, and only then mount the navigator, keyed on the story id and resolved state so switching between two flow stories — including two step stories with the same state but different `initialState` — remounts rather than reuses.

**4. `initialState` seeds the back-stack, avoiding an app-code change.** To make a _step_ story start on, say, `ObservationCreate` "as if arrived via `AddPhoto`", the naive fix is a new `initialRouteName` prop on `RootStackNavigator`. `NavigationContainer`'s `initialState` does it with zero app-code change and additionally reproduces a realistic back-stack, so the header back button behaves correctly in the screenshot:

```ts
parameters: {flow: {initialState: {
  routes: [{name: 'Home'}, {name: 'Categories'}, {name: 'ObservationCreate'}],
  index: 2,
}}}
```

Note `initialState` routes must exist in the branch `RootStackNavigator` renders for the given flow state — seeding `ObservationCreate` requires a device name _and_ a project, or `createAppScreens` is never rendered.

**Nesting note**: `NavigationIndependentTree` is not required. Storybook replaces `AppNavigator` rather than nesting below it (`App.tsx`), and Storybook RN v10's UI is a View/drawer composition rather than a React Navigation tree. On-device flow and atomic-navigation smoke checks showed no nested-container warning after removing the wrapper.

### `flowState.ts`

```ts
// .rnstorybook/utils/flowState.ts  (shape, not final code)
export type FlowStateSpec = {
  auth?: 'authenticated' | 'unauthenticated';
  deviceName?: string | null; // null → attempt clear (Open Question 1)
  project?: 'none' | {name: string; observations?: number};
};

export const FLOW_STATES = {
  freshInstall: {auth: 'authenticated', deviceName: null, project: 'none'},
  lockedApp: {
    auth: 'unauthenticated',
    deviceName: 'Test Device',
    project: 'none',
  },
  namedNoProject: {
    auth: 'authenticated',
    deviceName: 'Test Device',
    project: 'none',
  },
  onboardedWithData: {
    auth: 'authenticated',
    deviceName: 'Test Device',
    project: {name: 'Storybook Project', observations: 5},
  },
} satisfies Record<string, FlowStateSpec>;

export function useFlowState(spec?: FlowStateSpec): {key: string} | null;
```

`useFlowState` applies each axis (skipping axes already matching, so re-selecting the same story is fast), returns `null` while working, and returns a stable `key` once the observed state matches the spec. It lives next to — and shares the project/observation-seeding half with — the `seedData.ts` helpers from master-plan task 2.4, which this PRD finally implements.

Per-axis mechanics:

- **auth** — `useSecurityActions().setPasscode(null | '12345')`. `AuthProvider` derives `authState` from `passcode === null`.
- **project `'none'`** — clear the zustand store (needs Task 2.2). Backend projects are intentionally _not_ deleted; the provider's auto-select effect has already run, so a cleared store stays cleared for the session.
- **project `{name, observations}`** — `useCreateProject` + `setActiveProjectId`, then N observations via `useCreateDocument({docType:'observation'})`, reusing the pattern at `src/frontend/screens/ComapeoSettings/CreateTestData.tsx:233-312`. Idempotent: look up a project by name first and reuse it.
- **deviceName `'…'`** — `useSetOwnDeviceInfo().mutateAsync({name, deviceType})`.
- **deviceName `null`** — the unresolved case. See Open Question 1.

### Story taxonomy

Two kinds of flow story per journey, because they answer different questions:

| Kind            | Title                                             | Purpose                                                                                                                                  | Automatable               |
| --------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **Walkthrough** | `Flows/Onboarding/Walkthrough`                    | A human taps `Next` → `Next` → … through the real navigator. Proves the journey _connects_.                                              | No — one screenshot only  |
| **Step**        | `Flows/Onboarding/01 Intro`, `02 Data Privacy`, … | Each mounts the real navigator with a `flow.state` + `flow.initialState` that lands exactly on that screen. Proves each frame _renders_. | Yes — one screenshot each |

Both come from one decorator and one flow-state spec; a Step story is a Walkthrough story with `initialState` seeded. This is the answer to the multi-step-verification question posed in scoping: **automated coverage comes from Step stories, not from scripting taps.** Storybook RN has no on-device "tap and wait" primitive, and building one (an auto-advance decorator driving `navigationRef` on a timer) is a poor trade — it would be non-deterministic in exactly the way the deep-link capture approach was chosen to avoid. It is listed as a stretch (Task 5.4), not a commitment.

---

## Implementation Plan

### Phase 1: Flow-state foundation

**Goal**: Make app state settable from a story. **Estimated time**: 1 day.

- [x] **1.1** Implement `.rnstorybook/utils/seedData.ts` (master-plan task 2.4, still a stub): `useSeedProject(name)` and `useSeedObservations(count, options)` using `useCreateProject` / `useCreateDocument` / `usePresetsQuery`, following `CreateTestData.tsx:233-312`. Both must be idempotent — re-running a story must not create a second project. **Implemented, but via the imperative `useClientApi()` client rather than the suspense-query hooks named above** — `useManyDocs`/`useSingleProject` would suspend or throw when called with a projectId that doesn't exist yet, which is exactly the situation `flowState.ts` calls these hooks in before a project has been created. `useSeedObservations` also takes `projectId` as an `ensure(projectId)` argument rather than a hook param, so it can seed a project id resolved moments earlier by `useSeedProject` in the same async sequence without a stale closure.
- [x] **1.2** Add `clearActiveProjectId` to the `actions` object in `createActiveProjectIdStore` (`src/frontend/contexts/ActiveProjectIdStoreContext.tsx`). The flow-state behavior remains this PRD's only new production-state change. Static `App.tsx` integration and Metro disabled stubbing are separately required by the governing master Storybook plan; see the final scope resolution above.
- [x] **1.3** Create `.rnstorybook/utils/flowState.ts` with `FlowStateSpec`, `FLOW_STATES` presets, and `useFlowState`. **New finding while implementing this**: `AuthContext`'s `authState` is local React state seeded once when `AuthProvider` mounts (above Storybook) and is only otherwise changed by `authenticate()` or an AppState background transition — calling `setPasscode()` alone does _not_ flip it mid-session. This means the `auth: 'unauthenticated'` axis (used only by `lockedApp`) sets the passcode but won't visibly show `AuthScreen` within a running Storybook session; it would need a fresh app boot. `freshInstall`/`namedNoProject`/`onboardedWithData` are unaffected since they only need `auth: 'authenticated'`, which is what `AuthContext` already boots into by default. Documented in `flowState.ts`'s `useFlowState` docblock rather than as a new PRD risk, since none of the Phase 3/4 flows currently plan to use `lockedApp`.
- [x] **1.4** Resolve Open Question 1 (clearing the device name) empirically and record the outcome in this file. Do this **before** 2.x — the answer determines whether `freshInstall` is a real preset or a documented limitation. **Resolved: clearable, see Open Question 1.**
- [x] **1.5** Add a `FlowStatePlaceholder` component (spinner + the spec being applied, as text) so a story that hangs mid-seed is diagnosable from a screenshot alone. Implemented at `.rnstorybook/utils/FlowStatePlaceholder.tsx`.

### Phase 2: `withRealNavigator`

**Goal**: One decorator that mounts the real stack. **Estimated time**: 0.5 day.

- [x] **2.1** Create `.rnstorybook/decorators/withRealNavigator.tsx` per the Architecture shape; export from `.rnstorybook/decorators/index.ts`.
- [x] **2.2** Verify nesting: confirm whether `NavigationIndependentTree` is required under Storybook RN v10 + `@react-navigation/native@7.2.2`. Removed it: Storybook replaces `AppNavigator`, so the flow navigator has no parent React Navigation tree. On-device flow and atomic-navigation smoke checks emitted no nested-container warning.
- [x] **2.3** Smoke story `Flows/_Sanity/Fresh Install` — `flow.state: FLOW_STATES.freshInstall`, no `initialState`. Passes when it lands on `IntroToCoMapeo` unprompted. **Verified on-device (deep link `flows-sanity--fresh-install`): lands correctly when state already matches. When a mutation is needed first (e.g. right after `Onboarded` ran), hits the remount race in new Risk 8 — landed on `Success` once instead. Re-running once state was already clean was reliable.**
- [x] **2.4** Smoke story `Flows/_Sanity/Onboarded` — `FLOW_STATES.onboardedWithData`. Passes when it lands on `Home`. Expect map-surface caveats (Risk 3). **Flow-state application (auth/deviceName/project/5 observations) worked correctly and it did land on `Home`, but `MapScreen` then threw a hard render error — see the addendum to Risk 3. Not a flowState.ts/decorator bug; a `Home`-specific issue for Task 4.5 to resolve.**
- [x] **2.5** Document the "story function renders `null`, the decorator renders everything" convention in `.rnstorybook/README.md`.

### Phase 3: Flow A — Onboarding

**Goal**: The first-launch journey, walkable and capturable. **Estimated time**: 1 day.

Real order, from `src/frontend/Navigation/Stack/OnboardingScreens.tsx`: `IntroToCoMapeo` → `DataPrivacy` → `OnboardingPrivacyPolicy` → `DeviceNaming` → `Success` → (`JoinProjectIntro` | `MapOnYourOwnIntro`).

- [x] **3.1** `Flows/Onboarding/Walkthrough` — `freshInstall`, no `initialState`. On-device, tapped Intro → Data Privacy → privacy policy → Device Naming → Success → Map On Your Own → Home without leaving Storybook.
- [x] **3.2** Step stories `01 Intro` … `05 Success`, each seeding `flow.initialState` with the real back-stack up to that screen. All five resolved to their named screens through mixed-order deep links without restart.
- [x] **3.3** Branch stories `06a Join Project Intro` and `06b Map On Your Own Intro`, documenting in each description which user choice leads there. Both resolved through direct deep links; the walkthrough uses Map On Your Own.
- [x] **3.4** **Splash decision — record, don't build.** No live splash story: `ServerLoading` renders `null`, and it has already resolved before Storybook mounts. The narrative starts at `IntroToCoMapeo`. If the capture output ever needs a cover frame, use the static asset from `assets/` in the report generator (Task 5.3), not a story.
- [x] **3.5** The Walkthrough description records that completing `DeviceNaming` mutates real backend state and that `freshInstall` must be re-applied before replaying it. The on-device run re-applied Fresh Install successfully after completion.

### Phase 4: Flow B — First observation

**Goal**: A representative first-real-usage journey. **Estimated time**: 1 day.

Screens confirmed present in `src/frontend/Navigation/Stack/AppScreens.tsx`: `Home` (167), `ObservationCategoryChooser` (227), `Categories` (407), `AddPhoto` (177), `ObservationCreate` (373), `ObservationFields` (353), `ObservationMetadata` (489), `Observation` (232).

- [x] **4.1** `Flows/CreateObservation/Walkthrough` — direct interaction reaches Home → Category Chooser → Observation Create; both final cold-start full-manifest runs captured all six numbered Create Observation frames and recovered to a leaf story.
- [x] **4.2** Step stories: `01 Home` → `02 Category Chooser` → `03 Add Photo` → `04 Observation Create` → `05 Observation Fields` → `06 Observation Detail`. All six directly rendered in mixed order with named-screen evidence.
- [x] **4.3** `06 Observation Detail` uses a runtime-resolved, deterministically ordered seeded observation id through an `initialState` factory.
- [x] **4.4** `AddPhoto` is accepted as camera chrome only; emulator preview fidelity is excluded.
- [x] **4.5** Handle `Home` / `MapScreen`: map chrome is in scope and tiles are excluded. Both accepted cold runs proved the visible nested Map screen via native `testID:MAIN.map-screen`; no tile-content assertion is made.

### Phase 5: Verification tooling

**Goal**: Turn the proven ad-hoc script into repo infrastructure. **Estimated time**: 1 day.

- [x] **5.1** Add `scripts/storybook-capture.sh` — configurable package id/post-ready delay, device wait, identity-first cold-link retry, exact current native story-and-route or story-and-testID readiness proof before and after capture, and PNG/size guard.
- [x] **5.2** Add `scripts/storybook-capture-all.sh` — reads `.rnstorybook/capture-manifest.tsv`, preflights IDs against Storybook source index, records force-stop/log-clear/launcher/`Running "main"` cold-start provenance inside the output directory, requires exact runtime identity and current target readiness, fails fast, and writes deterministic ledgers. Fixtures prove stale/mismatched readiness, missing/wrong route, and missing testID frames are not certified.
- [x] **5.3** Add a report generator producing one safe `index.html` filmstrip per flow; fixtures cover escaping, validation, idempotence, and destination-symlink rejection.
- [ ] **5.4** _(Stretch, not committed)_ Auto-advance mode: `flow.autoAdvance: ['DataPrivacy', 'DeviceNaming', ...]` driving `navigationRef` on a timer, capturing between hops. Only pursue if Step stories prove insufficient in practice.
- [x] **5.5** Document the verified disposable-device, generation, cold-start, readiness-aware capture, reporting, recovery, and emulator-reset workflow in `.rnstorybook/README.md`.

---

## Verification Criteria

1. `Flows/Onboarding/Walkthrough` starts on `IntroToCoMapeo` on a device that has already been through onboarding — proving the state reset works, not merely that a fresh emulator works.
2. Tapping through the Walkthrough reaches `Success` without leaving Storybook.
3. Every Step story lands on its named screen when selected directly by deep link, in any order, with no restart between selections.
4. `scripts/storybook-capture-all.sh` produces one non-blank PNG per manifest entry, exit code 0, on a run that includes both flows.
5. Re-running the full capture twice in a row yields the same set of screens (order and identity — not byte-identical images; timestamps and GPS readouts will differ).
6. Selecting a leaf-component story after a flow story still renders correctly — flow stories must not leave the app in a state that breaks the existing ~30 stories.
7. Production-state behavior changes only in `ActiveProjectIdStoreContext.tsx` (Task 1.2). Flow stories live under `src/frontend/flows/`; `App.tsx` static Storybook integration and Metro disabled stubbing are required by the master-plan scope resolution above.

Final result: criteria 1–7 passed. Accepted captures are
`/tmp/storybook-residual-accepted-run1.QH2w1c` and
`/tmp/storybook-residual-accepted-run2.O963PG`; each contains wrapper-generated
`cold-start-provenance.txt`, their first five ledger fields match for all 12
rows, all four reports exist, both leaf recoveries passed, and manual inspection
found the six named onboarding screens in both runs rather than
`FlowStatePlaceholder`.

---

## Potential Risks and Mitigations

1. **Flow stories mutate real, persistent state.** Storybook runs against the real backend; walking onboarding really names the device, and seeding really writes observations. A later story can therefore start from a state the earlier story created.
   _Mitigation_: `useFlowState` asserts and re-applies the spec on every story mount rather than assuming. Ship a documented "reset the emulator" escape hatch (clear app data) for when the in-app reset is insufficient. Never point flow stories at a device holding real user data.

2. ~~**Device name may not be clearable** (Open Question 1).~~ **RESOLVED**: it is clearable (Task 1.4, empty-string name accepted by core). This risk did not materialize — `freshInstall` works via `getInitialRoute` as designed.

3. **`Home` renders a native map.** Already flagged in the master plan. Emulator map surfaces render inconsistently and screenshots may show a blank or partial map.
   _Mitigation_: Scope visual verification to map _chrome_, not tiles (Task 4.5). Do not let flaky map pixels fail the capture run.
   **Lifecycle finding**: the error is not caused by `RootStackNavigator` or `MapScreen` remounting. `App.tsx` is the sole caller of `appRpc.mapServer.listen()`, while the backend retains one non-idempotent map server across frontend reloads. An HMR/frontend reload can therefore invoke `listen()` twice against the same server. Cold-start, no-HMR acceptance runs reached Home's map chrome without this error. Treat map tiles as capture-ineligible in Phase 4, and track a durable App/backend lifecycle fix separately from this flow-story work.

4. ~~**Nested `NavigationContainer`.** RN Navigation v7 warns on nested containers.~~ **RESOLVED**: Storybook does not supply a parent React Navigation tree in this mount, so `NavigationIndependentTree` was removed after device smoke checks.

5. **`initialState` can name a route that isn't registered.** `RootStackNavigator` renders one of three screen sets. Seeding `ObservationCreate` while `deviceName` is unset silently produces an empty or wrong screen.
   _Mitigation_: each flow story pairs route state with the matching `flow.state`; the capture harness requires exact story identity plus current, story-specific native readiness for the declared direct route or stable native testID immediately before and after capture. Historical route logs are diagnostic only and cannot certify a frame.

6. ~~**Seeding races the capture delay.**~~ **RESOLVED**: capture waits up to 300 seconds for exact target readiness, then applies the manifest's post-ready delay. The first cold seed empirically exceeded 120 seconds; no screenshot is taken from `FlowStatePlaceholder` while convergence continues.

7. **`storybook.requires.ts` drift.** Adding flow stories without re-running `sb-rn-get-stories` means the capture script deep-links to ids that do not exist — and a missing id fails _silently_, leaving the previous story on screen and producing a plausible-looking wrong screenshot.
   _Mitigation (implemented)_: capture-all preflights every manifest ID against the generated source index, then requires the exact runtime linking identity and readiness target before capture. Cold-start selection is retried only while identity remains unobserved.

8. **Remount race after a mutating axis — HIGH PRIORITY, blocks Phase 3.** Empirically found while testing the `Flows/_Sanity` stories (Task 2.3/2.4): when `useFlowState` has to actually mutate an axis (e.g. clear the device name), `setReady()`/the `NavigationContainer` remount can fire before `RootStackNavigator`'s own `useOwnDeviceInfo()`/`useActiveProjectId()` reads have caught up to the new value, so it mounts on the wrong initial route (observed: landed on `Success` instead of `IntroToCoMapeo` right after clearing device name + project). A **no-op** re-selection (state already matching the spec, nothing to mutate) is reliable — only the "had to change something this pass" path races. Confirmed the underlying mutations _do_ land correctly (a follow-up read a few seconds later showed the correct cleared state) — this is purely a remount-timing issue, not a data-correctness one.
   _Mitigation (implemented and proven)_: `useFlowState` mutates one mismatched routing axis per pass, then waits for the matching subscription value to cause a fresh render before checking again. It marks ready only on a pass where every routing axis already matches; readiness is keyed structurally to the active spec so Storybook parameter-object rerenders do not restart a completed flow. Five cold-start, no-HMR `Onboarded` → `Fresh Install` alternations reached Home then IntroToCoMapeo every time.

---

## Open Questions

1. **RESOLVED (2026-08-20, Task 1.4).** Yes — the device name can be cleared. `useSetOwnDeviceInfo().mutateAsync({name: '', deviceType: 'mobile'})` resolves without error, and the immediately-following `useOwnDeviceInfo()` read shows `name: ''`. Verified on-device via a scratch story (`Flows/_Spike/DeviceNameClear`, deleted after this finding was recorded) deep-linked with `flows-spike-devicenameclear--default`: screenshot showed `before: name="jjjj"` (leftover from a prior manual walkthrough) → `mutateAsync resolved` → `device name now: ""`. `!deviceInfo.name` in `getInitialRoute` is falsy for `''`, so this routes to `IntroToCoMapeo` as hoped. `freshInstall` is therefore a real preset, not a documented limitation — `flowState.ts`'s `deviceName: null` axis maps to `mutateAsync({name: '', deviceType: 'mobile'})`.
   ~~`useSetOwnDeviceInfo` is typed `{name: string; deviceType}` — no clear, no `undefined`. `!deviceInfo.name` in `getInitialRoute` is falsy for `''`, so `mutate({name: ''})` _would_ route to `IntroToCoMapeo` **if** core accepts an empty name rather than rejecting it as invalid. Unverified.~~

2. **RESOLVED (2026-08-20).** The canonical onboarding narrative takes `MapOnYourOwnIntro`, because it needs no second device. Both `JoinProjectIntro` and `MapOnYourOwnIntro` remain direct step stories.

3. **Is `Flows/CreateObservation` the right second flow?** It is the most demonstrable first-use journey and exercises seeding hardest. Alternatives worth considering later: joining a project via invite (needs two devices — likely infeasible in Storybook) or the sync flow (same constraint).

4. **Should captures be diffed in CI?** Out of scope here, and probably premature: emulator map tiles, GPS readouts, and timestamps make naive pixel diffing noisy. Revisit once the filmstrip has been in use long enough to know which frames are actually stable.

---

## Effort Estimate Summary

| Phase                               | Scope                                                                      | Time    | Cumulative |
| ----------------------------------- | -------------------------------------------------------------------------- | ------- | ---------- |
| Phase 1: Flow-state foundation      | `seedData` impl, `clearActiveProjectId`, `flowState.ts`, device-name spike | 1 day   | 1 day      |
| Phase 2: `withRealNavigator`        | Decorator + 2 sanity stories                                               | 0.5 day | 1.5 days   |
| Phase 3: Flow A — Onboarding        | Walkthrough + 5 steps + 2 branches                                         | 1 day   | 2.5 days   |
| Phase 4: Flow B — First observation | Walkthrough + 6 steps                                                      | 1 day   | 3.5 days   |
| Phase 5: Verification tooling       | 2 scripts, manifest, filmstrip report, docs                                | 1 day   | 4.5 days   |

**Total: ~4.5 working days.**

**Minimum viable (Phases 1–3): ~2.5 days** — one fully walkable, fully capturable journey, which is enough to settle whether this approach earns the rest.

This is additive to the master plan's ~12-day estimate and independent of Phases 5–7; the flow layer can be built before, after, or alongside the atomic per-screen stories.
