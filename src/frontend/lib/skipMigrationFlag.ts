import {storage} from '../hooks/persistedState/createPersistedState';

const FORCE_SKIP_MIGRATE_KEY = '@ForceSkipMigrate';

/**
 * "Skip for Now" on the low-space migration screen is session-only: the Node
 * backend can only be started once per app process, so skipping requires a
 * full process restart (RNRestart). This flag carries the user's choice
 * across that restart. It is consumed (read and cleared) by the very next
 * launch, so every later full launch offers the migration again.
 */
export function setSkipMigrationOnNextLaunch() {
  storage.set(FORCE_SKIP_MIGRATE_KEY, true);
}

export function consumeSkipMigrationFlag(): boolean {
  const value = storage.getBoolean(FORCE_SKIP_MIGRATE_KEY) ?? false;
  if (value) {
    storage.remove(FORCE_SKIP_MIGRATE_KEY);
  }
  return value;
}
