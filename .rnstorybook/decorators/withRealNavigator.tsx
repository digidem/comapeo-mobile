import * as React from 'react';
import type {Decorator} from '@storybook/react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  type InitialState,
} from '@react-navigation/native';

import {RootStackNavigator} from '../../src/frontend/Navigation/Stack';
import {useFlowState, type FlowStateSpec} from '../utils/flowState';
import {FlowStatePlaceholder} from '../utils/FlowStatePlaceholder';

type FlowParameters = {
  flow?: {
    state?: FlowStateSpec;
    initialState?: InitialState;
  };
};

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

  if (!ready) return <FlowStatePlaceholder spec={flow?.state} />;

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        key={`${context.id}:${ready.key}`}
        initialState={flow?.initialState}>
        <RootStackNavigator />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};
