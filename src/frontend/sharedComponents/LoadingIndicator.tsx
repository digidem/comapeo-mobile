import {ActivityIndicator, type ActivityIndicatorProps} from 'react-native';
import {COMAPEO_BLUE} from '../lib/styles';

type Props = ActivityIndicatorProps;

const isE2E = process.env.EXPO_PUBLIC_E2E_TEST === 'true';

// React Native's ActivityIndicator renders the platform's native indeterminate
// spinner, animated by the OS view itself — no JS, Animated, or reanimated work
// per frame. It replaces react-native-indicators, which is unmaintained and
// whose radial-transform layout collapses to a line under the New Architecture.
//
// Animation is off under E2E: it causes rendering delays on Browserstack when
// checking for spinner state.
/**
 * Defaults to `size="large"` and `color={COMAPEO_BLUE}`.
 */
export const LoadingIndicator = ({
  size = 'large',
  color = COMAPEO_BLUE,
  animating = !isE2E,
  ...props
}: Props) => (
  <ActivityIndicator
    size={size}
    color={color}
    animating={animating}
    {...props}
  />
);
