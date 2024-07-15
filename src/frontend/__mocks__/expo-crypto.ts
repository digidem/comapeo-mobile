import {
  createHash,
  type BinaryToTextEncoding,
  randomBytes as nodeRandomBytes,
} from 'node:crypto';

export enum CryptoDigestAlgorithm {
  SHA512 = 'sha512',
}

export enum CryptoEncoding {
  HEX = 'hex',
  BASE64 = 'base64',
}

export const getRandomBytes = (byteCount: number): Uint8Array =>
  // Though Node `Buffer`s are `Uint8Array` subclasses, their behavior is
  // [subtly different][0], so convert the result to be safe.
  // [0]: https://nodejs.org/docs/latest-v22.x/api/buffer.html#buffers-and-typedarrays
  new Uint8Array(nodeRandomBytes(byteCount));

type CryptoDigestOptions = {
  encoding: CryptoEncoding;
};

/**
 * Ponyfill of `crypto.hash` for old environments.
 *
 * [0]: https://nodejs.org/api/crypto.html#cryptohashalgorithm-data-outputencoding
 */
const hash = (
  algorithm: string,
  data: string | Uint8Array,
  outputEncoding: BinaryToTextEncoding,
): string => createHash(algorithm).update(data).digest(outputEncoding);

export const digestStringAsync = (
  algorithm: CryptoDigestAlgorithm,
  data: string,
  options: CryptoDigestOptions = {encoding: CryptoEncoding.HEX},
): Promise<string> => Promise.resolve(hash(algorithm, data, options.encoding));
