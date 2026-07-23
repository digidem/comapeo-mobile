import {ActivityIndicator, type ActivityIndicatorProps} from 'react-native';
import {COMAPEO_BLUE} from '../lib/styles';

type Props = ActivityIndicatorProps;

// React Native's ActivityIndicator renders the platform's native indeterminate
// spinner, animated by the OS view itself — no JS, Animated, or reanimated work
// per frame. It replaces react-native-indicators, which is unmaintained and
// whose radial-transform layout collapses to a line under the New Architecture.
export const LoadingIndicator = ({
  size = 'large',
  color = COMAPEO_BLUE,
  ...props
}: Props) => <ActivityIndicator size={size} color={color} {...props} />;
