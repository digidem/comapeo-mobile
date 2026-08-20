# Handoff — Storybook User-Story Flows

**Read first**: `plans/2026-08-20-storybook-user-story-flows.md` (the PRD, in full — Status line at top summarizes checkbox state). This file is just the pickup briefing; the PRD is the source of truth for scope, architecture, risks, and open questions.

**Branch**: `feat/storybook-integration`. The flow-state foundation, sanity stories, documentation, and this briefing are committed. Check `git status` first: `.claude/` and `.codesight/` are local generated metadata and intentionally remain untracked.

## What's done

- Phase 1 (all 5 tasks): `.rnstorybook/utils/seedData.ts`, `.rnstorybook/utils/flowState.ts`, `.rnstorybook/utils/FlowStatePlaceholder.tsx`, `clearActiveProjectId` added to `src/frontend/contexts/ActiveProjectIdStoreContext.tsx` (the only `src/` file this PRD touches — keep it that way).
- Phase 2 Tasks 2.1, 2.3, 2.4, and 2.5: `.rnstorybook/decorators/withRealNavigator.tsx` is exported from `decorators/index.ts`; `src/frontend/flows/Sanity.stories.tsx` adds `Flows/_Sanity/Fresh Install` and `Flows/_Sanity/Onboarded`; `.rnstorybook/README.md` documents the flow-story convention.
- Supporting Storybook fixes are also committed: corrected decorator barrel paths, `withNavigation` for `BottomSheetWrapper`, and Storybook-side splash hiding in `src/frontend/App.tsx`.

## Risk 8 status: fixed in code, device proof pending

`useFlowState` now uses the PRD's re-render-driven convergence loop: it mutates one mismatched routing axis, waits for its observed subscription value on the next render, and only marks the current spec ready when every axis already matches. Readiness is spec-scoped so a user advancing a walkthrough is not reset, and `withRealNavigator` keys the navigation container with `context.id` as well as resolved state so step stories cannot reuse a previous `initialState`.

`npx tsc --noEmit --incremental false` passed with `.rnstorybook/**/*` temporarily included, and Storybook generation passed. The required five alternating emulator runs are not complete: selecting `Onboarded` reproduces the known Home error boundary, which prevents the subsequent `Fresh Install` story from rendering, and force-stopping/relaunching the app left Storybook blank. Resolve or safely bypass that lifecycle failure before claiming Risk 8's device acceptance criterion.

After the Home lifecycle failure is resolved or safely bypassed, run `EXPO_PUBLIC_STORYBOOK_ENABLED=true npm run storybook-generate`, deep-link between `flows-sanity--onboarded` and `flows-sanity--fresh-install` at least five times, and confirm each `Fresh Install` lands on `IntroToCoMapeo` immediately after `Onboarded` dirtied state. Do not mark Risk 8 verified from a no-op Fresh Install selection alone.

## Also worth a look before Phase 4: the `Home`/`MapScreen` crash

Landing on `Home` via `withRealNavigator` threw "Listen method has been called more than once without closing" (a `net.Server.listen` call, surfaced through `MapScreen/index.tsx`), caught by Storybook's own error boundary. Full detail is in the PRD's Risk 3 addendum. Every Phase 4 (CreateObservation) step story ends up at `Home`, so root-cause this before Phase 4 can produce reliable captures.

The source map points at `MapScreen/index.tsx:52`, but the app-level candidate is `src/frontend/App.tsx:115`: `appRpc.mapServer.listen()` runs at module scope. Verify whether Storybook/Metro remount or HMR evaluates that module more than once before changing it. The PRD currently limits flow work to one `src/` change (`ActiveProjectIdStoreContext.tsx`); raise any necessary scope expansion before altering `App.tsx` or map-server lifecycle code.

## Next agent sequence

1. Verify whether `NavigationIndependentTree` is required (Task 2.2); retain it unless device evidence proves it is a no-op.
2. Resolve or bypass the Home lifecycle error, then complete Risk 8's five-run alternating device check.
3. Start Phase 3 only after that proof. Read its task list and Open Question 2; the PRD recommends `MapOnYourOwnIntro` for the canonical walkthrough.

## Working environment notes

- Android emulator (`emulator-5554`) and package `com.comapeo.dev` are already running/installed; Metro is already running on port 8081 (`expo start --port 8081`) — don't start a second one.
- Deep-link capture method (reliable, no app restart needed between story selections):
  ```bash
  adb shell am start -n com.comapeo.dev/.MainActivity -a android.intent.action.VIEW \
    -d "storybook://x?STORYBOOK_STORY_ID=<story-id>"
  sleep 2 && adb shell screencap -p /sdcard/shot.png && adb pull /sdcard/shot.png <out.png>
  ```
  Story ids are `sanitize(title)--sanitize(story-name)`, lowercase, non-alphanumeric collapsed to single dashes (e.g. `Flows/_Sanity` + `Fresh Install` → `flows-sanity--fresh-install`).
- After adding/renaming stories, re-run `EXPO_PUBLIC_STORYBOOK_ENABLED=true npm run storybook-generate` before deep-linking to them (Risk 7 — a missing id fails silently, leaving the previous screen on-screen with no error).
- `.rnstorybook/**` is excluded from both `tsconfig.json`'s `include` and the eslint config, so `npm run lint:types` / `npm run lint:eslint` silently skip it. To typecheck changes there, temporarily add `.rnstorybook/**/*` to `tsconfig.json`'s `include`, run `npx tsc --noEmit`, then revert the tsconfig change before finishing (don't commit that expansion — out of this PRD's scope).
- Any scratch/spike story used to empirically verify something (pattern used for Task 1.4's device-name-clearing spike) should be deleted once its finding is written into the PRD — don't leave debug stories in the tree.
