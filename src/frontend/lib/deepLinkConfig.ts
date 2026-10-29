import type {LinkingOptions} from '@react-navigation/native';
import type {AppStackParamsList} from '../sharedTypes/navigation';

// Must match `INTERNET_INVITE_PAGE` in @comapeo/core/invite-urls.js — core
// puts this origin into every invite link it generates.
export const DEEP_LINK_HOST = 'a.comapeo.app';
export const INVITE_LINK_PATH = '/invite';

export const linking: LinkingOptions<AppStackParamsList> = {
  prefixes: ['comapeo://', `https://${DEEP_LINK_HOST}`],
};
