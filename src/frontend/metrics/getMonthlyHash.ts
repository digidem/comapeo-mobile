import {CryptoDigestAlgorithm, digest} from 'expo-crypto';
import {uint8ArrayToHex} from 'uint8array-extras';

function writeMonthAndYearToBytes(
  bytes: Uint8Array,
  date: Readonly<Date>,
): void {
  new DataView(bytes.buffer).setUint16(0, date.getUTCFullYear(), true);
  bytes[2] = date.getUTCMonth();
}

function writeStringToBytes(
  bytes: Uint8Array,
  offset: number,
  str: string,
): void {
  for (let i = 0; i < str.length; i++) {
    bytes[i + offset] = str.charCodeAt(i) % 255;
  }
}

function dataToBytes(
  salt: string,
  metricsDeviceId: string,
  now: Date,
): Uint8Array {
  const result = new Uint8Array(3 + salt.length + metricsDeviceId.length);
  writeMonthAndYearToBytes(result, now);
  writeStringToBytes(result, 3, salt);
  writeStringToBytes(result, 3 + salt.length, metricsDeviceId);
  return result;
}

export async function getMonthlyHash(
  salt: string,
  metricsDeviceId: string,
  now: Date,
): Promise<string> {
  const hashedBuffer = await digest(
    CryptoDigestAlgorithm.SHA512,
    dataToBytes(salt, metricsDeviceId, now),
  );

  const hashedBytes = new Uint8Array(hashedBuffer);
  return uint8ArrayToHex(hashedBytes);
}
