import PostHog from 'posthog-react-native';
import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';
import {getAppVariant} from './appVariant';

const APP_VARIANT = getAppVariant();

export const postHog = new PostHog(
  'phc_cr3WAkAaM5rsbiTUF36fzlu8HTrfzL8nOy5elccBdpq',
  {
    host: 'https://us.i.posthog.com',
    // @ts-expect-error - this is the zustand typing, which is he same as posthog's customStorage typing. But zustand typing is less strict, but its quite a ts workaround to make it work, this is the simplest solution.
    customStorage: MMKVStoreInitializer,
    defaultOptIn: false,
    // disable for dev mode and e2e tests
    disabled:
      process.env.EXPO_PUBLIC_E2E_TEST === 'true' ||
      APP_VARIANT === 'development' ||
      APP_VARIANT === 'preRelease',
  },
);
