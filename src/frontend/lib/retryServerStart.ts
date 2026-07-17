import nodejs from '@comapeo/nodejs-mobile-react-native';
import {Paths} from 'expo-file-system';

/**
 * Handled by the 'server:restart' listener in src/backend/src/app.js — the
 * Node runtime can only start once per app process, so retrying re-runs the
 * backend's init in-process.
 */
export function retryServerStart({
  forceSkipMigrate,
}: {
  forceSkipMigrate: boolean;
}) {
  nodejs.channel.post('server:restart', {
    forceSkipMigrate,
    availableDiskSpace: Paths.availableDiskSpace,
  });
}
