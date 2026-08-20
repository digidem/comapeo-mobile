/**
 * Deterministic app-state presets for flow stories (see the PRD's
 * "Architecture" section: plans/2026-08-20-storybook-user-story-flows.md).
 *
 * `useFlowState` applies each axis of a `FlowStateSpec` to the running
 * session/backend and reports back once the observed state matches the
 * spec. It shares the project/observation-seeding logic with `seedData.ts`.
 */
import * as React from 'react';
import {useOwnDeviceInfo, useSetOwnDeviceInfo} from '@comapeo/core-react';
import {deviceType as expoDeviceType} from 'expo-device';

import {
  useSecurityActions,
  useSecurityState,
} from '../../src/frontend/contexts/SecurityStoreContext';
import {
  useActiveProjectId,
  useActiveProjectIdActions,
} from '../../src/frontend/contexts/ActiveProjectIdStoreContext';
import {expoToCoreDeviceType} from '../../src/frontend/lib/deviceTypeMap';
import {useSeedObservations, useSeedProject} from './seedData';

export type FlowStateSpec = {
  auth?: 'authenticated' | 'unauthenticated';
  /** `null` clears the device name (see Open Question 1 in the PRD — confirmed clearable). */
  deviceName?: string | null;
  project?: 'none' | {name: string; observations?: number};
};

export const FLOW_STATES = {
  freshInstall: {
    auth: 'authenticated',
    deviceName: null,
    project: 'none',
  },
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

// 5 digits, not the reserved obscure code — see PasscodeInputSchema in
// src/frontend/lib/security.ts.
const DEV_PASSCODE = '13579';

const DEVICE_TYPE = expoToCoreDeviceType(expoDeviceType);

function buildKey(spec: FlowStateSpec, resolvedProjectId: string | undefined) {
  const projectPart =
    spec.project === 'none' || !spec.project
      ? 'none'
      : `${spec.project.name}:${spec.project.observations ?? 0}`;
  return [spec.auth, spec.deviceName, projectPart, resolvedProjectId].join('|');
}

type ReadyFlowState = {
  key: string;
  spec: FlowStateSpec | undefined;
};

/**
 * Applies `spec` to the running backend/session, returning `null` while an
 * axis is still being applied and a stable `{key}` once the observed state
 * matches. Pass no spec to skip flow-state application entirely (e.g. for a
 * Walkthrough story that intentionally starts from whatever state a prior
 * story left behind).
 *
 * Known limitation: the `auth: 'unauthenticated'` axis sets the passcode,
 * but cannot force `AuthContext`'s `authState` to flip mid-session —
 * `authState` is local React state seeded once when `AuthProvider` mounts
 * (above Storybook) and is otherwise only changed by `authenticate()` or an
 * AppState background transition (src/frontend/contexts/AuthContext.tsx).
 * `lockedApp` therefore reflects on screen only on a fresh app boot with no
 * passcode set yet, not on-demand within a running Storybook session. Every
 * other preset only needs `auth: 'authenticated'`, which is what
 * `AuthContext` already boots into whenever no passcode was set at launch,
 * so this doesn't affect them.
 */
export function useFlowState(spec?: FlowStateSpec): {key: string} | null {
  const passcode = useSecurityState(state => state.passcode);
  const {setPasscode} = useSecurityActions();

  const {data: deviceInfo} = useOwnDeviceInfo();
  const {mutateAsync: setDeviceInfo} = useSetOwnDeviceInfo();

  const activeProjectId = useActiveProjectId();
  const {setActiveProjectId, clearActiveProjectId} =
    useActiveProjectIdActions();

  const projectName =
    typeof spec?.project === 'object' ? spec.project.name : '';
  const {ensure: ensureProject} = useSeedProject(projectName);

  const observationsCount =
    typeof spec?.project === 'object' ? (spec.project.observations ?? 0) : 0;
  const {ensure: ensureObservations} = useSeedObservations(observationsCount);

  const [ready, setReady] = React.useState<ReadyFlowState | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const isReadyForCurrentSpec = ready !== null && ready.spec === spec;

  React.useEffect(() => {
    if (isReadyForCurrentSpec) return;

    let cancelled = false;
    const fail = (reason: unknown) => {
      if (!cancelled) {
        setError(reason instanceof Error ? reason : new Error(String(reason)));
      }
    };

    if (!spec) {
      setReady({key: 'flow:none', spec});
      return () => {
        cancelled = true;
      };
    }
    // Mutate one mismatched axis, then wait for that axis's subscription to
    // report the new value on a later render. In particular, do not mark the
    // flow ready immediately after a query mutation: RootStackNavigator has
    // its own subscription to these values and would otherwise mount from a
    // stale cache snapshot (PRD Risk 8).
    // Bind to a const: TS narrowing does not carry into this async closure.
    const spec_ = spec;

    async function apply() {
      if (spec_.auth === 'authenticated' && passcode !== null) {
        setReady(null);
        await setPasscode(null);
        if (cancelled) return;
        return;
      }

      if (spec_.auth === 'unauthenticated' && passcode === null) {
        setReady(null);
        await setPasscode(DEV_PASSCODE);
        if (cancelled) return;
        return;
      }

      const desiredDeviceName =
        spec_.deviceName === null ? '' : spec_.deviceName;
      if (
        typeof desiredDeviceName === 'string' &&
        deviceInfo.name !== desiredDeviceName
      ) {
        setReady(null);
        await setDeviceInfo({
          name: desiredDeviceName,
          deviceType: DEVICE_TYPE,
        });
        if (cancelled) return;
        return;
      }

      if (spec_.project === 'none' && activeProjectId) {
        setReady(null);
        clearActiveProjectId();
        return;
      }

      if (spec_.project) {
        setReady(null);
        const projectId = await ensureProject();
        if (cancelled) return;

        if (projectId !== activeProjectId) {
          setActiveProjectId(projectId);
          return;
        }

        await ensureObservations(projectId);
        if (cancelled) return;
      }

      setReady({key: buildKey(spec_, activeProjectId), spec: spec_});
    }

    apply().catch(fail);

    return () => {
      cancelled = true;
    };
  }, [
    activeProjectId,
    clearActiveProjectId,
    deviceInfo.name,
    ensureObservations,
    ensureProject,
    isReadyForCurrentSpec,
    passcode,
    setActiveProjectId,
    setDeviceInfo,
    setPasscode,
    spec,
  ]);

  // Surface seeding failures loudly (nearest error boundary) rather than
  // hanging forever behind FlowStatePlaceholder with no visible cause.
  if (error) throw error;

  return isReadyForCurrentSpec ? ready : null;
}
