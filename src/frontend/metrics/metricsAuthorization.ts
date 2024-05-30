const CAESAR_SHIFT = 144;

export const encodeMetricsAuthorization = (original: string): string => (
  new TextEncoder()
    .encode(original)
    .map((byte) => byte + CAESAR_SHIFT)
    .join("_")
);

export const decodeMetricsAuthorization = (encoded: string): string => {
  const bytesArray = encoded
    .split("_")
    .map((byteString) => (
      parseInt(byteString, 10) - CAESAR_SHIFT
    ));
  const bytes = new Uint8Array(bytesArray);
  return new TextDecoder().decode(bytes);
};
