import type {Decorator} from '@storybook/react-native';

/**
 * Minimal decorator - passthrough that renders <Story /> directly.
 *
 * With the in-app integration strategy, all base providers (IntlProvider,
 * SafeAreaProvider, GestureHandlerRootView) are already available from
 * App.tsx and AppProviders. This decorator marks stories that only need
 * base React Native primitives.
 */
export const minimal: Decorator = Story => <Story />;
