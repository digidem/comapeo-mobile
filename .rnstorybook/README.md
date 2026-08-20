# Storybook flow stories

There are two different kinds of stories in this Storybook:

- **Leaf stories** exercise one screen or component in isolation. Use the
  `withNavigation` decorator when the component needs ordinary navigation
  context. The decorator mounts the story component inside its small stack.
- **Flow stories** exercise a user journey through the app's real navigation.
  Use `withRealNavigator`. The real `RootStackNavigator` is mounted by the
  decorator, so the story function is only a Storybook placeholder and should
  render `null` (or a short, non-essential legend). The decorator renders
  everything visible; do not put a second screen or navigator in the story
  function.

## Flow story shape

```tsx
const NoStoryComponent = () => null;

const meta = {
  title: 'Flows/Onboarding',
  component: NoStoryComponent,
  decorators: [withRealNavigator],
} satisfies Meta<typeof NoStoryComponent>;

export const Intro: Story = {
  parameters: {
    flow: {
      state: FLOW_STATES.freshInstall,
      // Optional: seed a navigation back-stack for a specific step.
      initialState: navigationState,
    },
  },
};
```

`flow.state` describes the backend/device state that must be applied before
the navigator mounts. Use `flow.initialState` when a story needs to begin at a
particular step or reproduce a realistic back-stack. Every route in
`initialState` must exist in the screen set selected by that flow state; for
example, app routes require an authenticated, named device and an active
project. The decorator remounts the real navigator after state application so
its initial-route decision is made from the resolved state.

The `lockedApp`/`auth: 'unauthenticated'` preset is currently limited: changing
the passcode does not update `AuthContext`'s already-mounted auth state. Use a
fresh app boot when a flow must visibly start at `AuthScreen`.

After adding or renaming stories, regenerate Storybook's story index before
selecting or deep-linking to them:

```bash
EXPO_PUBLIC_STORYBOOK_ENABLED=true npm run storybook-generate
```
