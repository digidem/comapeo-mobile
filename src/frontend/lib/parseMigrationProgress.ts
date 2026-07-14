/**
 * The backend reports storage-migration progress via the MIGRATING server
 * state's `context` field as a `"done/total"` string (e.g. `"3/12"`). It is
 * the empty string until the first core has been counted.
 */
export function parseMigrationProgress(
  context: string | undefined,
): {done: number; total: number} | null {
  if (!context) return null;
  const match = /^(\d+)\/(\d+)$/.exec(context);
  if (!match) return null;
  const done = Number(match[1]);
  const total = Number(match[2]);
  if (total === 0) return null;
  return {done, total};
}
