/**
 * The backend sends how many more bytes we need as a string in `context`,
 * e.g. `"52428800"`.
 */
export function parseSpaceNeeded(context: string | undefined): number | null {
  if (!context) return null;
  const bytes = Number(context);
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  return bytes;
}

const UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/** Formats a byte count as a rounded-up "~N MB"-style string. */
export function formatSpaceNeeded(bytes: number): string {
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  const rounded = value < 10 ? Math.ceil(value * 10) / 10 : Math.ceil(value);
  return `~${rounded} ${UNITS[unitIndex]}`;
}
