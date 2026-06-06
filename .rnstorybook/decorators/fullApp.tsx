import type {Decorator} from '@storybook/react-native';

/**
 * Full app decorator - passthrough that renders <Story /> directly.
 *
 * With the in-app integration strategy, all app contexts (ComapeoCore,
 * Location, LocalDiscovery, Auth, ActiveProject, etc.) are already
 * available from AppProviders. This decorator marks stories that depend
 * on the full app context including the running backend.
 */
export const fullApp: Decorator = Story => <Story />;
