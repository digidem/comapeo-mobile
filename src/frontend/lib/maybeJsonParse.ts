import type {JsonValue} from 'type-fest';

/**
 * Try to parse a string as JSON. If it fails, returns `undefined`.
 */
export function maybeJsonParse(value: string): undefined | JsonValue {
  try {
    return JSON.parse(value);
  } catch (_) {
    return;
  }
}
