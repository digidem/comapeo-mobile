export function setIfNotNull<ObjT, KeyT extends keyof ObjT>(
  obj: ObjT,
  key: KeyT,
  value: null | ObjT[KeyT],
): void {
  if (value !== null) obj[key] = value;
}
