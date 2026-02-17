export const LOW_THRESHOLD_BYTES = 500 * 1024 * 1024;

export function isLowStorage(
  freeBytes: number,
  threshold: number = LOW_THRESHOLD_BYTES,
) {
  return freeBytes <= threshold;
}

export function calcUsedPercentage(
  freeBytes: number,
  totalBytes: number,
): number {
  if (totalBytes <= 0) return 0;
  const free = Math.max(0, freeBytes);
  const used = Math.max(0, totalBytes - free);
  return Math.round((used / totalBytes) * 100);
}
