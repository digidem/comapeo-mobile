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
  const total = Number(match[2]);
  if (total === 0) return null;
  // make sure the UI never shows more than 100%.
  const done = Math.min(Number(match[1]), total);
  return {done, total};
}
