import * as React from 'react';
import type {Decorator} from '@storybook/react-native';
import {View} from 'react-native';
import {
  NavigationContainer,
  type InitialState,
  type NavigationContainerRef,
} from '@react-navigation/native';

import {RootStackNavigator} from '../../src/frontend/Navigation/Stack';
import type {AppStackParamsList} from '../../src/frontend/sharedTypes/navigation';
import {
  useFlowState,
  type FlowStateSpec,
  type ResolvedFlowState,
} from '../utils/flowState';
import {FlowStatePlaceholder} from '../utils/FlowStatePlaceholder';

type FlowInitialState =
  | InitialState
  | ((resolved: ResolvedFlowState) => InitialState);

type FlowParameters = {
  flow?: {
    state?: FlowStateSpec;
    initialState?: FlowInitialState;
  };
};

type ActiveRoute = {
  storyId: string;
  readyKey: string;
  routeName: string;
};

function assertFactoryUsesSeededObservationIds(
  initialState: InitialState,
  resolved: ResolvedFlowState,
) {
  const seededIds = new Set(resolved.observationIds);

  function visit(value: unknown) {
    if (!value || typeof value !== 'object') return;

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    const record = value as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(record, 'observationId')) {
      const observationId = record.observationId;
      if (typeof observationId !== 'string' || !seededIds.has(observationId)) {
        throw new Error(
          `Storybook flow initialState requested missing seeded observation ID: ${String(observationId)}`,
        );
      }
    }

    Object.values(record).forEach(visit);
  }

  visit(initialState);
}

function guardMissingSeededObservationIds(
  resolved: ResolvedFlowState,
): ResolvedFlowState {
  const observationIds = new Proxy(resolved.observationIds, {
    get(target, property, receiver) {
      const isArrayIndex =
        typeof property === 'string' && /^(0|[1-9]\d*)$/.test(property);
      if (
        isArrayIndex &&
        !Object.prototype.hasOwnProperty.call(target, property)
      ) {
        throw new Error(
          `Storybook flow initialState requested missing seeded observation ID at index ${property}`,
        );
      }
      return Reflect.get(target, property, receiver);
    },
  });

  return {...resolved, observationIds};
}

/**
 * Real-navigator decorator — mounts `RootStackNavigator` (the actual
 * navigator the shipping app uses), not `AppNavigator`. Reimplements just
 * the two things `AppNavigator` contributes on top of it (a
 * `NavigationContainer` and this Suspense-free wrapper); it deliberately
 * skips `AppNavigator`'s `PostHogProvider` screen-tracking (would pollute
 * analytics with synthetic screen views) and its `SplashScreen.hide()` call
 * (already handled once by `StorybookRoot` in App.tsx).
 *
 * For **flow stories only** — atomic per-screen QA should keep using
 * `withNavigation`. A flow story's "component" is the journey, not a React
 * element: the story function should render `null` (or a short legend);
 * everything visible comes from this decorator via `parameters.flow`.
 *
 * `key={ready.key}` forces a fresh `NavigationContainer` mount once flow
 * state has been applied, since `getInitialRoute()` (in
 * `Navigation/Stack/index.tsx`) is only evaluated at mount.
 */
export const withRealNavigator: Decorator = (Story, context) => {
  const {flow} = (context.parameters ?? {}) as FlowParameters;
  const ready = useFlowState(flow?.state);
  const readyKey = ready?.key;
  const navigationRef =
    React.useRef<NavigationContainerRef<AppStackParamsList>>(null);
  const [activeRoute, setActiveRoute] = React.useState<ActiveRoute>();
  const announceActiveRoute = React.useCallback(() => {
    const route = navigationRef.current?.getCurrentRoute();
    if (!route || !readyKey) {
      console.error(
        `STORYBOOK: Flow readiness failed for story: ${context.id}; active route unavailable`,
      );
      return;
    }

    setActiveRoute({
      storyId: context.id,
      readyKey,
      routeName: route.name,
    });

    // Retain this log for diagnostics. Capture acceptance uses the current
    // native markers rendered below, because an earlier route log cannot prove
    // which route is active when the screenshot is taken.
    console.log(
      `STORYBOOK: Flow ready for story: ${context.id}; route: ${route.name}`,
    );
  }, [context.id, readyKey]);

  if (!ready) return <FlowStatePlaceholder spec={flow?.state} />;

  let initialState: InitialState | undefined;
  if (typeof flow?.initialState === 'function') {
    initialState = flow.initialState(guardMissingSeededObservationIds(ready));
    assertFactoryUsesSeededObservationIds(initialState, ready);
  } else {
    initialState = flow?.initialState;
  }

  const isCurrentRoute =
    activeRoute?.storyId === context.id && activeRoute.readyKey === ready.key;
  const storyReadyTestId = isCurrentRoute
    ? `STORYBOOK.flow-ready.${context.id}`
    : undefined;
  const routeReadyTestId = isCurrentRoute
    ? `${storyReadyTestId}.${activeRoute.routeName}`
    : undefined;

  return (
    <View style={{flex: 1}} testID={storyReadyTestId}>
      <View style={{flex: 1}} testID={routeReadyTestId}>
        <NavigationContainer
          key={`${context.id}:${ready.key}`}
          ref={navigationRef}
          initialState={initialState}
          onReady={announceActiveRoute}
          onStateChange={announceActiveRoute}>
          <RootStackNavigator />
        </NavigationContainer>
      </View>
    </View>
  );
};
