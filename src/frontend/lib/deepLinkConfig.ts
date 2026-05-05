import * as ExpoLinking from 'expo-linking';
import type {LinkingOptions} from '@react-navigation/native';
import type {AppStackParamsList} from '../sharedTypes/navigation';

// Custom scheme for testing: comapeo://
// App Links (https): https://app.comapeo.org/
//
// The hash fragment (#) is intentionally used for sensitive invite data in the
// full invite-over-internet flow so it is never sent to the server (per
// https://www.notion.so/digidem/Invite-over-the-internet-2e61b08162d580e9a861c3bf93c58d70#3281b08162d58094b975fbc2844511db ).
// React Navigation's linking config operates on the path portion only; the consuming
// screen (InviteReceived?) is responsible for parsing window.location.hash /
// the raw URL when needed to get the secret.

export const DEEP_LINK_HOST = 'app.comapeo.org';

export const deepLinkReady = {appIsReady: false};

export function setDeepLinkReady(appIsReady: boolean) {
  deepLinkReady.appIsReady = appIsReady;
}

export const linking: LinkingOptions<AppStackParamsList> = {
  prefixes: [ExpoLinking.createURL('/'), `https://${DEEP_LINK_HOST}`],
  config: {
    screens: {
      InviteReceived: 'invite/:inviteId',
    },
  },
};

// For now handles both custom scheme that is useful for preproduction
// and testing: (comapeo://invite/<id>) and
// Whatever we end up using (ex. https://app.comapeo.org/invite/<id>).
export function parseInviteUrl(url: string): string | null {
  try {
    const parsed = ExpoLinking.parse(url);
    // https URLs: scheme=https, hostname=app.comapeo.org, path=invite/abc123
    const pathMatch = (parsed.path || '').match(/^invite\/(.+)$/);
    if (pathMatch) return pathMatch[1] ?? null;
    // Custom scheme URLs: scheme=comapeo, hostname=invite, path=abc123
    if (parsed.hostname === 'invite' && parsed.path) return parsed.path;
    return null;
  } catch {
    return null;
  }
}
