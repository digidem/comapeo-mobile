# Additional Notes for E2E Testing Performance on BrowserStack

Here find environment-specific changes made to reduce execution time for E2E tests on BrowserStack.

## E2E-Specific UI Behavior

The environment variable `EXPO_PUBLIC_E2E_TEST=true` is used in CI and for the build type "test" to modify app behavior and improve test performance in the following ways:

### Auth Flow (Passcode Input)

- `src/frontend/contexts/AuthContext.tsx`: Disables ``FlagSecureModule` during E2E tests to allow screen recording on BrowserStack.
- `src/frontend/screens/AuthScreen.tsx`: Hides the `CoMapeoLogoSvg`, which was delaying input responsiveness.

### Map Style Fallback

- `src/frontend/hooks/server/maps.ts`: Switches to a public Mapbox style instead of fetching from the internal map server, which can fail with 502 errors in CI (issue #1008).

### Audio Recording

- `src/frontend/screens/Audio/AudioRecording/index.tsx`: Replaces the `AnimatedBackground` with a blank `<View />` in E2E mode. This animation was causing unnecessary Appium rendering delays that seem to happen with animations.

### GPS Pill

- `src/frontend/sharedComponents/GPSPill.tsx`: Replaces the `UIActivityIndicator` spinner with text (`...`) during E2E tests to eliminate rendering delays that seem to happen with animations when checking for GPS status.
