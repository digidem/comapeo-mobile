import * as ExpoLinking from 'expo-linking';
import type {LinkingOptions} from '@react-navigation/native';
import type {AppStackParamsList} from '../sharedTypes/navigation';

// Custom scheme for testing: comapeo://
// App Links (https): https://app.comapeo.org/
//
// The hash fragment (#) is intentionally used for sensitive invite data in the
// full invite-over-internet flow so it is never sent to the server. React
// Navigation's linking config operates on the path portion only; the consuming
// screen (InviteReceived?) is responsible for parsing window.location.hash / the raw URL when
// needed to get the secret.
//
// Supported deep link paths:
//   invite/<inviteId>  →  InviteReceived screen (onboarding + app contexts)

export const DEEP_LINK_HOST = 'app.comapeo.org';

export const linking: LinkingOptions<AppStackParamsList> = {
  prefixes: [ExpoLinking.createURL('/'), `https://${DEEP_LINK_HOST}`],
  config: {
    screens: {
      InviteReceived: 'invite/:inviteId',
    },
  },
};

// Parses an invite ID out of a deep link URL.
// Returns null if the URL is not a recognised invite link.
// Handles both custom scheme that is useful for preproduction
// and testing: (comapeo://invite/<id>) and
// Whatever we presumably use (https://app.comapeo.org/invite/<id>).
export function parseInviteUrl(url: string): string | null {
  try {
    const parsed = ExpoLinking.parse(url);
    const path = parsed.path || '';
    const match = path.match(/^invite\/(.+)$/);
    return match ? (match[1] ?? null) : null;
  } catch {
    return null;
  }
}
