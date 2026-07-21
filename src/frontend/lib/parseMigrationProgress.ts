/**
 * The backend sends progress as a "done/total" string in `context`, e.g.
 * `"3/12"`. It's an empty string until the first core is counted.
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
