# Storybook User-Story Flows

**Status**: In progress — Phase 1 done, Phase 2 mostly done (Task 2.2 open), and Risk 8 is fixed in code and typechecked. Its required repeated on-device proof is blocked by Risk 3's Home error boundary and a blank post-relaunch Storybook surface. See `plans/handoff.md` for the next-agent briefing.
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
    <NavigationIndependentTree>
      <NavigationContainer
        key={`${context.id}:${ready.key}`}
        initialState={seed}>
        <RootStackNavigator />
      </NavigationContainer>
    </NavigationIndependentTree>
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

**Nesting note**: `@react-navigation/native@7.2.2`. If Storybook's own UI is itself a navigation tree, a bare nested `NavigationContainer` warns. `withNavigation` currently nests without visible trouble, so this may be a no-op — but wrap in `NavigationIndependentTree` defensively and drop it if verified unnecessary.

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
- [x] **1.2** Add `clearActiveProjectId` to the `actions` object in `createActiveProjectIdStore` (`src/frontend/contexts/ActiveProjectIdStoreContext.tsx`). Two lines. This is the **only application-code change** this PRD requires; keep it that way.
- [x] **1.3** Create `.rnstorybook/utils/flowState.ts` with `FlowStateSpec`, `FLOW_STATES` presets, and `useFlowState`. **New finding while implementing this**: `AuthContext`'s `authState` is local React state seeded once when `AuthProvider` mounts (above Storybook) and is only otherwise changed by `authenticate()` or an AppState background transition — calling `setPasscode()` alone does _not_ flip it mid-session. This means the `auth: 'unauthenticated'` axis (used only by `lockedApp`) sets the passcode but won't visibly show `AuthScreen` within a running Storybook session; it would need a fresh app boot. `freshInstall`/`namedNoProject`/`onboardedWithData` are unaffected since they only need `auth: 'authenticated'`, which is what `AuthContext` already boots into by default. Documented in `flowState.ts`'s `useFlowState` docblock rather than as a new PRD risk, since none of the Phase 3/4 flows currently plan to use `lockedApp`.
- [x] **1.4** Resolve Open Question 1 (clearing the device name) empirically and record the outcome in this file. Do this **before** 2.x — the answer determines whether `freshInstall` is a real preset or a documented limitation. **Resolved: clearable, see Open Question 1.**
- [x] **1.5** Add a `FlowStatePlaceholder` component (spinner + the spec being applied, as text) so a story that hangs mid-seed is diagnosable from a screenshot alone. Implemented at `.rnstorybook/utils/FlowStatePlaceholder.tsx`.

### Phase 2: `withRealNavigator`

**Goal**: One decorator that mounts the real stack. **Estimated time**: 0.5 day.

- [x] **2.1** Create `.rnstorybook/decorators/withRealNavigator.tsx` per the Architecture shape; export from `.rnstorybook/decorators/index.ts`.
- [ ] **2.2** Verify nesting: confirm whether `NavigationIndependentTree` is required under Storybook RN v10 + `@react-navigation/native@7.2.2`. Remove it if not. **Not yet verified either way — kept defensively per the PRD's own instruction. Untouched.**
- [x] **2.3** Smoke story `Flows/_Sanity/Fresh Install` — `flow.state: FLOW_STATES.freshInstall`, no `initialState`. Passes when it lands on `IntroToCoMapeo` unprompted. **Verified on-device (deep link `flows-sanity--fresh-install`): lands correctly when state already matches. When a mutation is needed first (e.g. right after `Onboarded` ran), hits the remount race in new Risk 8 — landed on `Success` once instead. Re-running once state was already clean was reliable.**
- [x] **2.4** Smoke story `Flows/_Sanity/Onboarded` — `FLOW_STATES.onboardedWithData`. Passes when it lands on `Home`. Expect map-surface caveats (Risk 3). **Flow-state application (auth/deviceName/project/5 observations) worked correctly and it did land on `Home`, but `MapScreen` then threw a hard render error — see the addendum to Risk 3. Not a flowState.ts/decorator bug; a `Home`-specific issue for Task 4.5 to resolve.**
- [x] **2.5** Document the "story function renders `null`, the decorator renders everything" convention in `.rnstorybook/README.md`.

### Phase 3: Flow A — Onboarding

**Goal**: The first-launch journey, walkable and capturable. **Estimated time**: 1 day.

Real order, from `src/frontend/Navigation/Stack/OnboardingScreens.tsx`: `IntroToCoMapeo` → `DataPrivacy` → `OnboardingPrivacyPolicy` → `DeviceNaming` → `Success` → (`JoinProjectIntro` | `MapOnYourOwnIntro`).

- [ ] **3.1** `Flows/Onboarding/Walkthrough` — `freshInstall`, no `initialState`. Tappable start to finish.
- [ ] **3.2** Step stories `01 Intro` … `05 Success`, each seeding `flow.initialState` with the real back-stack up to that screen.
- [ ] **3.3** Branch stories `06a Join Project Intro` and `06b Map On Your Own Intro`, documenting in each description which user choice leads there.
- [ ] **3.4** **Splash decision — record, don't build.** No live splash story: `ServerLoading` renders `null`, and it has already resolved before Storybook mounts. The narrative starts at `IntroToCoMapeo`. If the capture output ever needs a cover frame, use the static asset from `assets/` in the report generator (Task 5.3), not a story.
- [ ] **3.5** Note in the Walkthrough's description that completing `DeviceNaming` mutates real backend state — after a full walkthrough the device _is_ named, so `freshInstall` must be re-applied (Risk 1).

### Phase 4: Flow B — First observation

**Goal**: A representative first-real-usage journey. **Estimated time**: 1 day.

Screens confirmed present in `src/frontend/Navigation/Stack/AppScreens.tsx`: `Home` (167), `ObservationCategoryChooser` (227), `Categories` (407), `AddPhoto` (177), `ObservationCreate` (373), `ObservationFields` (353), `ObservationMetadata` (489), `Observation` (232).

- [ ] **4.1** `Flows/CreateObservation/Walkthrough` — `onboardedWithData`, `initialState` `[Home]`.
- [ ] **4.2** Step stories: `01 Home` → `02 Category Chooser` → `03 Add Photo` → `04 Observation Create` → `05 Observation Fields` → `06 Observation Detail`.
- [ ] **4.3** `06 Observation Detail` needs a seeded observation id in its route params. Extend `useSeedObservations` to return created ids and thread the first one through `flow.initialState`.
- [ ] **4.4** Handle `AddPhoto` / camera: `react-native-vision-camera` on an emulator gives a synthetic feed at best. Prefer capturing the permission-prompt or empty state, and document that the camera preview frame is not meaningfully verifiable by screenshot. Do not block the flow on it.
- [ ] **4.5** Handle `Home` / `MapScreen`: the master plan already flags this as hardware-bound. Capture whatever the emulator produces and treat map _tiles_ as out of scope for visual verification; the map chrome (GPS pill, buttons, bottom sheet) is in scope.

### Phase 5: Verification tooling

**Goal**: Turn the proven ad-hoc script into repo infrastructure. **Estimated time**: 1 day.

- [ ] **5.1** Add `scripts/storybook-capture.sh` — the promoted `/tmp/storybook-shots/capture_via_deeplink.sh`, hardened: configurable package id (default `com.comapeo.dev`), configurable settle delay, `adb wait-for-device`, non-zero exit if the pulled PNG is missing or suspiciously small (blank-frame guard).
- [ ] **5.2** Add `scripts/storybook-capture-all.sh` — reads a checked-in manifest (`.rnstorybook/capture-manifest.txt`, one story id per line, ordered), calls 5.1 per entry, writes numbered PNGs to an output dir. Ordering matters: flow steps should read as a filmstrip.
- [ ] **5.3** Add a report generator producing a single `index.html` filmstrip per flow, so a reviewer sees the whole journey in one scroll.
- [ ] **5.4** _(Stretch, not committed)_ Auto-advance mode: `flow.autoAdvance: ['DataPrivacy', 'DeviceNaming', ...]` driving `navigationRef` on a timer, capturing between hops. Only pursue if Step stories prove insufficient in practice.
- [ ] **5.5** Document the whole loop in `.rnstorybook/README.md`: `npm run storybook:android` → `npm run storybook-generate` after adding stories → `scripts/storybook-capture-all.sh`.

---

## Verification Criteria

1. `Flows/Onboarding/Walkthrough` starts on `IntroToCoMapeo` on a device that has already been through onboarding — proving the state reset works, not merely that a fresh emulator works.
2. Tapping through the Walkthrough reaches `Success` without leaving Storybook.
3. Every Step story lands on its named screen when selected directly by deep link, in any order, with no restart between selections.
4. `scripts/storybook-capture-all.sh` produces one non-blank PNG per manifest entry, exit code 0, on a run that includes both flows.
5. Re-running the full capture twice in a row yields the same set of screens (order and identity — not byte-identical images; timestamps and GPS readouts will differ).
6. Selecting a leaf-component story after a flow story still renders correctly — flow stories must not leave the app in a state that breaks the existing ~30 stories.
7. Exactly one file under `src/` is modified by this work (`ActiveProjectIdStoreContext.tsx`, Task 1.2).

---

## Potential Risks and Mitigations

1. **Flow stories mutate real, persistent state.** Storybook runs against the real backend; walking onboarding really names the device, and seeding really writes observations. A later story can therefore start from a state the earlier story created.
   _Mitigation_: `useFlowState` asserts and re-applies the spec on every story mount rather than assuming. Ship a documented "reset the emulator" escape hatch (clear app data) for when the in-app reset is insufficient. Never point flow stories at a device holding real user data.

2. ~~**Device name may not be clearable** (Open Question 1).~~ **RESOLVED**: it is clearable (Task 1.4, empty-string name accepted by core). This risk did not materialize — `freshInstall` works via `getInitialRoute` as designed.

3. **`Home` renders a native map.** Already flagged in the master plan. Emulator map surfaces render inconsistently and screenshots may show a blank or partial map.
   _Mitigation_: Scope visual verification to map _chrome_, not tiles (Task 4.5). Do not let flaky map pixels fail the capture run.
   **Worse than expected, found during Task 2.4**: landing on `Home`/`MapScreen` via `withRealNavigator` threw a hard render error — "Listen method has been called more than once without closing" (Node `net.Server.listen`, surfaced through `MapScreen/index.tsx`), caught by Storybook's per-story error boundary ("Something went wrong rendering your story"), not just a blank/partial tile. Likely cause: something MapScreen owns (probably a local tile/blob server) is only ever meant to start once for the app's whole lifetime, but flow stories remount `RootStackNavigator` (by design, Architecture decision 3) every time flow state changes, so `Home` can mount more than once per Storybook session. Not investigated further (Task 4.5's job). Re-selecting a different story afterward still worked (Storybook's error boundary recovered on next selection), so this doesn't wedge the whole session — but any flow/step story that lands on `Home` should be expected to be unreliable until this is root-caused.

4. **Nested `NavigationContainer`.** RN Navigation v7 warns on nested containers.
   _Mitigation_: `NavigationIndependentTree` (Task 2.2). Low risk — `withNavigation` already nests today without incident.

5. **`initialState` can name a route that isn't registered.** `RootStackNavigator` renders one of three screen sets. Seeding `ObservationCreate` while `deviceName` is unset silently produces an empty or wrong screen.
   _Mitigation_: `useFlowState` validates the spec/`initialState` pair and renders a loud error frame on mismatch — visible in a screenshot, which is the only diagnostic a capture run has.

6. **Seeding races the capture delay.** The fixed `sleep 2` was tuned for leaf components. A story that seeds a project plus five observations will take longer.
   _Mitigation_: Configurable per-story delay in the manifest, plus the blank-frame guard (Task 5.1). The `FlowStatePlaceholder` (Task 1.5) makes a too-short delay obvious rather than mysterious.

7. **`storybook.requires.ts` drift.** Adding flow stories without re-running `sb-rn-get-stories` means the capture script deep-links to ids that do not exist — and a missing id fails _silently_, leaving the previous story on screen and producing a plausible-looking wrong screenshot.
   _Mitigation_: `storybook-capture-all.sh` should assert the story actually changed (e.g. compare against the previous frame) rather than trusting the intent. This is a sharper version of master-plan risk 11.

8. **Remount race after a mutating axis — HIGH PRIORITY, blocks Phase 3.** Empirically found while testing the `Flows/_Sanity` stories (Task 2.3/2.4): when `useFlowState` has to actually mutate an axis (e.g. clear the device name), `setReady()`/the `NavigationContainer` remount can fire before `RootStackNavigator`'s own `useOwnDeviceInfo()`/`useActiveProjectId()` reads have caught up to the new value, so it mounts on the wrong initial route (observed: landed on `Success` instead of `IntroToCoMapeo` right after clearing device name + project). A **no-op** re-selection (state already matching the spec, nothing to mutate) is reliable — only the "had to change something this pass" path races. Confirmed the underlying mutations _do_ land correctly (a follow-up read a few seconds later showed the correct cleared state) — this is purely a remount-timing issue, not a data-correctness one.
   _Mitigation (implemented, on-device proof pending)_: `useFlowState` now mutates one mismatched routing axis per pass, then waits for the matching subscription value to cause a fresh render before checking again. It marks ready only on a pass where every routing axis already matches; readiness is tied to the active spec so a user advancing a walkthrough is not reset. The Storybook emulator reproduced Risk 3's Home error boundary during the required `Onboarded` → `Fresh Install` alternation, and a fresh app launch stayed blank, so the five-run device acceptance check remains pending.

---

## Open Questions

1. **RESOLVED (2026-08-20, Task 1.4).** Yes — the device name can be cleared. `useSetOwnDeviceInfo().mutateAsync({name: '', deviceType: 'mobile'})` resolves without error, and the immediately-following `useOwnDeviceInfo()` read shows `name: ''`. Verified on-device via a scratch story (`Flows/_Spike/DeviceNameClear`, deleted after this finding was recorded) deep-linked with `flows-spike-devicenameclear--default`: screenshot showed `before: name="jjjj"` (leftover from a prior manual walkthrough) → `mutateAsync resolved` → `device name now: ""`. `!deviceInfo.name` in `getInitialRoute` is falsy for `''`, so this routes to `IntroToCoMapeo` as hoped. `freshInstall` is therefore a real preset, not a documented limitation — `flowState.ts`'s `deviceName: null` axis maps to `mutateAsync({name: '', deviceType: 'mobile'})`.
   ~~`useSetOwnDeviceInfo` is typed `{name: string; deviceType}` — no clear, no `undefined`. `!deviceInfo.name` in `getInitialRoute` is falsy for `''`, so `mutate({name: ''})` _would_ route to `IntroToCoMapeo` **if** core accepts an empty name rather than rejecting it as invalid. Unverified.~~

2. **Which branch does the onboarding narrative take at `Success`?** `JoinProjectIntro` and `MapOnYourOwnIntro` are both real. Phase 3 builds both as leaf stories, but the canonical single-filmstrip "user story" should pick one. Recommend `MapOnYourOwnIntro` — it needs no second device — but this is a product-narrative call, not a technical one.

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
