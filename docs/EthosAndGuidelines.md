# Ethos and Guidelines

When writing code, [testing](#testability) and [maintainability](#maintainability) should be our focus for determining how to approach the composition of all features, chores, and fixes and should inform the reviewing of pull requests.

## Testability

More testing means fewer bugs and frees up people's time. The testing suite needs to be reliable for that to happen and cover happy paths, errors, and edge cases. Automated testing should provide as much coverage as possible.

### Types of Testing

- **End to end**
  - **What it is** — tests the app UI the way a user would use it. Follows the happy path as well as common edge and error cases. Blackbox testing with no knowledge of the JavaScript code.
  - **Value**
    - These can be a replacement for some of the processes and paths of manual QA testing.
    - They are the closest to real user interaction and what a user actually experiences.
  - **Problems**
    - Flaky — these tests will fail on BrowserStack often for no apparent reason
    - They take a long time to run, especially because we have to build an APK every time
    - Everything has to be done through user interaction, which can be verbose and add time to the test
    - A lot can't be done because of testing and BrowserStack limitations — e.g. take a photo, upload a file, do things with two devices, change location, change permissions
  - **Approach**
    - Write E2E tests for as many paths as possible
  - **Tools**
    - [Appium](https://appium.io), [WebdriverIO](https://webdriver.io), [Mocha](https://mochajs.org), and [BrowserStack](https://www.browserstack.com)
- **Integration**
  - **What it is** — tests logic and database interactions with the UI.
    - Mounted in a node process that simulates the React tree.
  - **Value**
    - Great for mocking different data configurations, edge cases, and errors.
    - Can be run locally, individually, and quickly in order to get immediate feedback
    - Can test individual components in isolation, e.g. GPS Pill, but this is less often necessary
  - **Problems**
    - Many things have to be mocked, such as many of our common libraries, e.g. MapLibre, Expo-Audio, etc.
    - Lots of boilerplate code is needed, partially because of the above-mentioned mocks
    - Can't test real user experience — can only test interactions within the React tree
  - **Approach**
    - We are not interested in snapshot testing (comparing React trees and computed pixels).
    - No need to test basic functionality of libraries
    - Mount the app in the testing suite and do E2E-style actions that bring you to the screen under test. Better not to test each screen in isolation. ([Kent C. Dodds — Write fewer, longer tests](https://kentcdodds.com/blog/write-fewer-longer-tests))
    - Tests that it handles errors appropriately.
    - Write integration tests for all screens where possible (but time box these to 1 day). Use for all situations that can't be tested with end-to-end tests. Focus on edge cases and errors.
  - **Tools**
    - [Jest](https://jestjs.io) and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- **Unit**
  - **What it is** — tests logic exclusively
  - **Value**
    - Can test logic, edge cases, and manipulate inputs easily
  - **Problems**
    - Changes the way code has to be written — logic must be written without React hooks.
  - **Approach**
    - Write functions in their own files that can be imported and reused in order to test in isolation. Otherwise the whole React file is included in the test, which is not the desired behavior.
    - Written in plain JavaScript (no React hooks)
  - **Tools**
    - [Jest](https://jestjs.io)

## Maintainability

The app should be maintainable for a long time, easily, by people who didn't originally write the code. This means that it is [readable](#readability), [up-to-date](#up-to-date) (with libraries), and can [easily be changed](#easily-changed).

### Readability

- **Why**
  - It can be easily understood.
  - Code should either be well-documented or structured in a way that makes it obvious why the code is the way that it is.
  - There should be little to no implicit "developer knowledge" — that is, knowledge that is not obvious in the code but is held by the developer and informs how the code is structured.
- **How**
  - Name variables clearly based on what things do in the UI
  - File structure should relate to the UI
  - Logic should be clear and easy to follow
    - Minimize IIFEs
    - Flow in one direction — React is top-down, so logic lives at the top level
    - Prefer repetition over complication

### Up to Date

- **Why**
  - Hardware and software (OS) is constantly changing, and if we do not keep up with those changes and are unaware of how they affect our app, the app becomes unusable.
- **How**
  - Update production dependencies once every other sprint where possible.
  - Update development dependencies once every six months, in January and July.
  - Document in each PR which updates are made, and if an update can't be made, explain why so it can be tracked for future updates.
  - However, in order to avoid malicious attacks, a library update must be at least 7 days old in order for us to update to it

### Easily Changed

- **Why**
  - UI requirements are constantly changing, so a component that can be modified or extended without introducing new issues or requiring a lot of time and effort is beneficial.
  - Code should be flexible enough that when changed, only a minimal amount of code needs to change while still producing the expected results.
  - It should also be resilient enough that unrelated external changes do not affect the code.
  - Developers can easily pick up the code and fix bugs or add new components that interact seamlessly with existing ones.
- **How**
  - A maintainable component can be easily modified and extended
  - Write simple code

## Awana Digital Best Practices

### Screens

- A screen is a nav screen — it must be navigable to.
- As much logic as possible is included here (as opposed to its components)
- All hooks at the top level
- Very occasionally an exception might have to be made for a hook that causes a lot of rerenders, eg. the [`<SendingMapProgressBar />`](../src/frontend/screens/BackgroundMaps/SendingMapProgressBar.tsx)

### Shared Components

- The UI pattern is repeated at least twice — otherwise it should live in the screen
- It helps fulfill an opinionated design preference
- Guidelines for shared components:
  - **Focus on the UI, not the logic.** Ask: what are the truly reusable parts? Share only those and let the rest be children.
  - **No prop forwarding** — if a prop is not used by the component itself and only passed down to a child, avoid that pattern entirely
  - **Props should be agnostic** — don't pass things the component doesn't care about
  - **Forward primitives, not objects** — don't pass a whole `field` object if all you need is `field.tagKey`; pass the primitive value instead
  - **Forward the minimum props needed** — aim for no more than 3
  - If a component is not shareable and is only used once, it can still be extracted for readability. In that case, nesting one level deep is fine as long as props are agnostic and minimal.

Examples of good shared components:

- **Media scroll view** — what was repeated was the sizing and scrollability. Whether children are images, colored squares, or something else doesn't matter.
- **Colored square** — what is being reused is the styling of the square. What is inside doesn't matter.
- **Screen content with dock** — what matters is scrollability with a button anchored at the bottom.

### State Management

- Persisted State
  - Each piece of persisted state should be scoped to its own Zustand store (see below)
- Zustand Stores
  - Zustand stores should always be put in context:
  - Use `createStore`, not `create`
  - Can be persisted or not — doesn't matter
  - Make sure context is passed in `AppProvider`
  - See [Zustand and React Context — Testing](https://tkdodo.eu/blog/zustand-and-react-context#testing)
- Derived State
  - If state can be calculated from other state, always calculate it — don't store it separately.
  - See [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state)
- Avoid State Syncing
  - Don't use `useEffect` to copy state from one place to another.
  - Avoid `useState` as much as possible
