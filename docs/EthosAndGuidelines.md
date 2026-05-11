# Ethos and Guidelines

## Testability

More testing means fewer bugs and frees up people's time for other things. The testing suite needs to be reliable for that to happen.

- **End to end** — tests the app UI the way a user would use it. Follows the happy path as well as common edge and error cases. Try to test as much as possible here.
- **Integration** — tests logic and database interactions with the UI.
  - Mounted in a node process that simulates the React tree.
  - We are not interested in snapshot testing (comparing React trees and computed pixels).
  - Approach: mount the app in the testing suite and do E2E-style actions that bring you to the screen under test. Better not to test each screen in isolation. (Kent C. Dodds / React docs)
  - We use Jest and React Native Testing Library.
- **Unit** — tests pure logic.

## Maintainability

The app should be maintainable for a long time, easily, by people who didn't originally write the code.

- Upgrade libraries as frequently as possible, and follow their standards (which also makes future upgrades easier)
- Write code that can be easily changed, knowing that needs and UI are constantly evolving

### Readability

- Name variables clearly based on what things do in the UI
- File structure should relate to the UI
- Logic should be clear and easy to follow
  - Minimize IIFEs
  - Flow in one direction — React is top-down, so logic lives at the top level
  - Prefer repetition over complication

### Screens

A screen is a nav screen — it must be navigable to.

- Logic lives here at the top level
- It is the entry point for a feature

### Shared Components

#### When to Create a Shared Component

- The UI pattern is repeated at least twice — otherwise it should live in the screen
- It helps fulfill an opinionated design preference

#### Guidelines for Shared Components

**Focus on the UI, not the logic.** Ask: what are the truly reusable parts? Share only those and let the rest be children.

- **No prop forwarding** — if a prop is not used by the component itself and only passed down to a child, avoid that pattern entirely
- **Props should be agnostic** — don't pass things the component doesn't care about
- **Forward primitives, not objects** — don't pass a whole `field` object if all you need is `field.tagKey`; pass the primitive value instead
- **Forward the minimum props needed** — aim for no more than 3

If a component is not shareable and is only used once, it can still be extracted for readability. In that case, nesting one level deep is fine as long as props are agnostic and minimal.

Examples of good shared components:
- **Media scroll view** — what was repeated was the sizing and scrollability. Whether children are images, colored squares, or something else doesn't matter.
- **Colored square** — what is being reused is the styling of the square. What is inside doesn't matter.
- **Screen content with dock** — what matters is scrollability with a button anchored at the bottom.

### State Management

#### Persisted State

Each piece of persisted state has its own provider.

#### Zustand Stores

Zustand stores should always be put in context:

- Use `createStore`, not `create`
- Can be persisted or not — doesn't matter
- Make sure context is passed in `AppProvider`
- See [Zustand and React Context — Testing](https://tkdodo.eu/blog/zustand-and-react-context#testing)

#### Derived State

If state can be calculated from other state, always calculate it — don't store it separately.

- See [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state)

#### Avoid State Syncing

Don't use `useEffect` to copy state from one place to another.
